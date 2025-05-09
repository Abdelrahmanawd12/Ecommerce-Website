﻿using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Jumia.Data;
using Jumia.Models;
using Jumia_Api.DTOs.AuthenticationDTOs;
using Jumia_Api.DTOs.AuthenticationDTOs.ForgotPasswordDTOs;
using Jumia_Api.DTOs.AuthenticationDTOs.RegisterDTOs;
using Jumia_Api.Services.Forgot_Password_Service;
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
        private readonly EmailService emailService;

        public AuthController(UserManager<ApplicationUser> _userManager, SignInManager<ApplicationUser> _signInManager, JumiaDbContext _db, ILogger<AuthController> logger,IConfiguration _config, EmailService emailService)

        {
            this.userManager = _userManager;
            this.signInManager = _signInManager;
            this.db = _db;
            this._logger = logger;
            this.config = _config;
            this.emailService = emailService;
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
                    if (!existingUser.IsDeleted)
                    {
                        return BadRequest("Email is already taken.");
                    }
                    else
                    {
                        existingUser.FirstName = cstDto.FirstName;
                        existingUser.LastName = cstDto.LastName;
                        existingUser.PhoneNumber = cstDto.PhoneNumber;
                        existingUser.DateOfBirth = cstDto.DateOfBirth;
                        existingUser.Gender = cstDto.Gender;
                        existingUser.UserName = cstDto.Email;
                        existingUser.Role = "Customer";
                        existingUser.IsDeleted = false;
                        existingUser.CreatedAt = DateTime.Now;
                        existingUser.PhoneNumberConfirmed = true;
                        existingUser.EmailConfirmed = true;

                        var token = await userManager.GeneratePasswordResetTokenAsync(existingUser);
                        var existingUserResult = await userManager.ResetPasswordAsync(existingUser, token, cstDto.Password);

                        if (existingUserResult.Succeeded)
                        {
                            await userManager.UpdateAsync(existingUser);
                            return Ok("Account reactivated successfully.");
                        }
                        else
                        {
                            return BadRequest(existingUserResult.Errors.Select(e => e.Description));
                        }
                    }
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
                    IsDeleted = cstDto.IsDeleted,
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
                    if (!existingUser.IsDeleted)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = "Email is already taken"
                        });
                    }
                    else
                    {
                        existingUser.FirstName = selDto.FirstName;
                        existingUser.LastName = selDto.LastName;
                        existingUser.PhoneNumber = selDto.PhoneNumber;
                        existingUser.DateOfBirth = selDto.DateOfBirth;
                        existingUser.Gender = selDto.Gender;
                        existingUser.UserName = selDto.Email;
                        existingUser.Role = "Seller";
                        existingUser.IsDeleted = false;
                        existingUser.CreatedAt = DateTime.Now;
                        existingUser.PhoneNumberConfirmed = true;
                        existingUser.EmailConfirmed = true;

                        if (existingUser is Seller sellerUser)
                        {
                            sellerUser.StoreName = selDto.StoreName;
                            sellerUser.ShippingZone = selDto.ShippingZone;
                            sellerUser.StoreAddress = selDto.StoreAddress;
                        }

                        var token = await userManager.GeneratePasswordResetTokenAsync(existingUser);
                        var existingUserResult = await userManager.ResetPasswordAsync(existingUser, token, selDto.Password);

                        if (existingUserResult.Succeeded)
                        {
                            await userManager.UpdateAsync(existingUser);
                            return Ok(new
                            {
                                success = true,
                                message = "Seller account reactivated successfully",
                                userId = existingUser.Id
                            });
                        }
                        else
                        {
                            return BadRequest(new
                            {
                                success = false,
                                message = "Reactivation failed",
                                errors = existingUserResult.Errors.Select(e => e.Description).ToList()
                            });
                        }
                    }
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
            if (existingUser != null && existingUser.IsDeleted == false)
            {
                return BadRequest(new { success = false, message = "Email is already taken and active" });
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
                if (User != null && User.IsDeleted == false)
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
                            expires: login.RememberMe ? DateTime.Now.AddDays(7) : DateTime.Now.AddHours(1),
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

            if (user == null || user.IsDeleted == true)
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

        //------------------------------------------------------
        //forgot-password


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return NotFound(new { message = "User not found." });

            var token = await userManager.GeneratePasswordResetTokenAsync(user);

            var frontendUrl = "http://localhost:4200/resetpassword";
            var resetLink = $"{frontendUrl}?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(user.Email)}";

            var success = await emailService.SendEmailAsync(
                user.Email,
                "Password Reset Request",
                resetLink
            );

            if (!success)
                return StatusCode(500, new { message = "Failed to send email. Please try again later." });

            return Ok(new { message = "Password reset link has been sent to your email." });
        }


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return NotFound(new { message = "User not found." });

            var result = await userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);

            if (result.Succeeded)
            {
                return Ok(new { message = "Password has been reset successfully." });
            }

            if (result.Errors.Any(e => e.Code == "InvalidToken"))
            {
                return BadRequest(new
                {
                    message = "This reset link has already been used or expired."
                });
            }

            return BadRequest(new
            {
                message = "Password reset failed.",
                errors = result.Errors.Select(e => e.Description)
            });
        }

        //------------------------------------------------------
        // Endpoint to send OTP to email

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequestDTO request)
        {
            if (string.IsNullOrEmpty(request.Email))
            {
                return BadRequest(new { message = "Email is required" });
            }

            var result = await emailService.SendOtpAsync(request.Email);
            if (result)
            {
                return Ok(new { message = "OTP sent successfully" });
            }
            else
            {
                return BadRequest(new { message = "Error sending OTP" });
            }
        }

        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequestDTO request)
        {
            var otpEntry = emailService.GetOtpByEmail(request.Email);

            if (otpEntry == null)
            {
                return BadRequest(new { message = "No OTP found for this email." });
            }

            if (otpEntry.IsUsed)
            {
                return BadRequest(new { message = "This OTP has already been used." });
            }

            if (otpEntry.Code != request.Otp)
            {
                return BadRequest(new { message = "Invalid OTP." });
            }

            if ((DateTime.UtcNow - otpEntry.CreatedAt).TotalMinutes > 15)
            {
                return BadRequest(new { message = "OTP has expired." });
            }

            emailService.MarkOtpAsUsed(request.Email);

            return Ok(new { message = "OTP verified successfully." });
        }

    }
}

