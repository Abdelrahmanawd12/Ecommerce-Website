using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Jumia.Data;
using Jumia.Models;
using Jumia_Api.DTOs.AuthenticationDTOs;
using Jumia_Api.DTOs.AuthenticationDTOs.RegisterDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
                    Addresses = new List<Address>() // Initialize Addresses to avoid null reference
                };

                if (cstDto.Addresses != null) // Check if Addresses is not null
                {
                    foreach (var addressDto in cstDto.Addresses)
                    {
                        var address = new Address
                        {
                            Street = addressDto.Street,
                            City = addressDto.City,
                            Country = addressDto.Country,
                            UserId = user.Id
                        };
                        user.Addresses.Add(address);
                        await db.SaveChangesAsync(); // Save changes asynchronously

                    }
                }

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
            if (ModelState.IsValid)
            {
                var existingUser = await userManager.FindByEmailAsync(selDto.Email);
                if (existingUser != null)
                {
                    return BadRequest("Username is already taken.");
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
                };

                IdentityResult result = await userManager.CreateAsync(user, selDto.Password);
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
    }
}

