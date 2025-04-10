using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Jumia.Data;
using Jumia.Models;
using Jumia_Api.DTOs.AuthenticationDTOs;
using Jumia_Api.DTOs.AuthenticationDTOs.RegisterDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Jumia_Api.Controllers.AuthenticationControllers
{
  
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        public JumiaDbContext db;
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration config;

        public AuthController(UserManager<ApplicationUser> _userManager, SignInManager<ApplicationUser> _signInManager, JumiaDbContext _db, ILogger<AuthController> logger,IConfiguration _config)
        {
            this.userManager = _userManager;
            this.signInManager = _signInManager;
            this.db = _db;
            this._logger = logger;
            this.config = _config;
        }

        //create new Account "Registeration" =>Customer
        [HttpPost("registeration")] //api/auth/registeration
        public async Task<IActionResult> Registeration([FromBody] CustomerRegisterDTO cstDto)
        {
            if (ModelState.IsValid)
            {
                var existingUser = await userManager.FindByEmailAsync(cstDto.Email);
                if (existingUser != null)
                {
                    return BadRequest("Username is already taken.");
                }
                ApplicationUser user = new ApplicationUser
                {
                    FirstName = cstDto.FirstName,
                    LastName = cstDto.LastName,
                    Email = cstDto.Email,
                    PhoneNumber = cstDto.PhoneNumber,
                    DateOfBirth = cstDto.DateOfBirth,
                    Gender = cstDto.Gender,
                    UserName = cstDto.Email,
                    CreatedAt = DateTime.Now,
                    Role = "Customer",
                    PhoneNumberConfirmed = true,
                    EmailConfirmed = true,
                };

                IdentityResult result = await userManager.CreateAsync(user, cstDto.Password);
                if (result.Succeeded)
                {
                    try
                    {

                        return Ok("Account Added Successfully");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"Error while saving user: {ex.Message}");
                        return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while saving the user");
                    }

                }
                else
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return BadRequest(errors);
                }

            }
            return BadRequest(ModelState);
        }

        //------------------------------------------------------

        //create new Account "Registeration" =>Seller
        [HttpPost("sellerRegisteration")] //api/auth/sellerRegisteration
        public async Task<IActionResult> SellerRegisteration([FromBody] SellerRegisterDTO selDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Validation failed",
                    errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }
            if (ModelState.IsValid)
            {
                var existingUser = await userManager.FindByEmailAsync(selDto.Email);
                if (existingUser != null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Registration failed",
                        errors = new List<string> { "Email is already taken." }
                    });
                }
                Seller user = new Seller()
                {
                    FirstName = selDto.FirstName,
                    LastName = selDto.LastName,
                    Email = selDto.Email,
                    PhoneNumber = selDto.PhoneNumber,
                    DateOfBirth = selDto.DateOfBirth,
                    Gender = selDto.Gender,
                    UserName = selDto.Email,
                    StoreName = selDto.StoreName,
                    ShippingZone = selDto.ShippingZone,
                    StoreAddress = selDto.StoreAddress,
                    CreatedAt = DateTime.Now,
                    Role = "Seller",
                    PhoneNumberConfirmed=true,
                    EmailConfirmed=true,
                };

                IdentityResult result = await userManager.CreateAsync(user, selDto.Password);
                if (result.Succeeded)
                {
                    try
                    {
                        return Ok(new
                        {
                            success = true,
                            message = "Account created successfully",
                            userId = user.Id
                        });
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"Error while saving user: {ex.Message}");
                        return StatusCode(StatusCodes.Status500InternalServerError, new
                        {
                            success = false,
                            message = "An error occurred while saving the user",
                            error = ex.Message
                        });
                    }

                }
                else
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return BadRequest(new
                    {
                        success = false,
                        message = "Registration failed",
                        errors = result.Errors.Select(e => e.Description).ToList()
                    });
                }

            }
            return BadRequest(ModelState);
        }

        [HttpGet("check-email")] // api/auth/check-email
        public async Task<IActionResult> CheckEmailUnique([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { success = false, message = "Email is required" });
            }

            var existingUser = await userManager.FindByEmailAsync(email);
            if (existingUser != null)
            {
                return BadRequest(new { success = false, message = "Email is already taken" });
            }

            return Ok(new { success = true, message = "Email is available" });
        }


        //------------------------------------------------------

        //Check existing User login
        [HttpPost("login")] //api/auth/login
        public async Task<IActionResult> Login(LoginDTO login)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser User = await userManager.FindByEmailAsync(login.Email);
                if (User != null)
                {
                   bool found = await userManager.CheckPasswordAsync(User,login.Password);
                    if (found)
                    {
                        //Claims Token
                        var claims = new List<Claim>();
                        claims.Add(new Claim(ClaimTypes.Email,User.Email));
                        claims.Add(new Claim(ClaimTypes.NameIdentifier,User.Id));
                        claims.Add(new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()));

                        //Create Role
                        var roles = await userManager.GetRolesAsync(User);
                        foreach (var role in roles)
                        {
                            claims.Add(new Claim(ClaimTypes.Role, role));
                        }

                        SecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:SecretKey"]));
                        SigningCredentials signinCred = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                        //create token 
                        JwtSecurityToken myToken = new JwtSecurityToken(
                            issuer: config["JWT:ValidIssuer"], //url wep api
                            audience: config["JWT:ValidAudience"], //url frontend
                            claims:claims,
                            expires:DateTime.Now.AddHours(1),
                            signingCredentials: signinCred
                            );
                        return Ok(new
                        {
                            token = new JwtSecurityTokenHandler().WriteToken(myToken),
                            expiration = myToken.ValidTo
                        });
                    }
                }
                return Unauthorized();
            }
            return Unauthorized();
        }

        //------------------------------------------------------

        [HttpGet("userByEmail")]
        public async Task<IActionResult> GetUserByEmail([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required");
            }

            var user = await db.Users
                .Where(u => u.Email == email)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound("User not found");
            }

            var userResponse = new
            {
                id = user.Id,
                role = user.Role,
                email = user.Email,
                token = "your_generated_token_here", 
                expiration = DateTime.UtcNow.AddHours(1).ToString()  
            };

            return Ok(userResponse);
        }


    }
}

