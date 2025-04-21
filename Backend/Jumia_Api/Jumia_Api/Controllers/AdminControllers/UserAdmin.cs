using AutoMapper;
using Jumia.Data;
using Jumia.Models;
using Jumia_Api.DTOs.AdminDTOs;
using Jumia_Api.DTOs.SellerDTOs;
using Jumia_Api.UnitOFWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jumia_Api.Controllers.AdminControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAdmin : ControllerBase
    {


            private readonly IMapper mapper;
            private readonly UserManager<ApplicationUser> userManager;

       
        private readonly JumiaDbContext _context;

      
        public UserAdmin(IMapper _mapper, UserManager<ApplicationUser> _userManager, JumiaDbContext context)
        {
            this.mapper = _mapper;
            this.userManager = _userManager;
            _context = context;
        }

      
        [HttpPut("editAdmin")]
        public async Task<IActionResult> EditAdmin(string id, [FromBody] AdminDTO adminDto)
        {
            var admin = await _context.Users.FindAsync(id);

            if (admin == null)
            {
                return NotFound("Admin not found.");
            }

         
            admin.FirstName = adminDto.FirstName;
            admin.LastName = adminDto.LastName;
            admin.Role = adminDto.Role;
            admin.Email = adminDto.Email;
            admin.DateOfBirth = adminDto.DateOfBirth;
            admin.Gender = adminDto.Gender;

            _context.Users.Update(admin);
            await _context.SaveChangesAsync();

            var updatedDto = mapper.Map<AdminDTO>(admin);
            return Ok(updatedDto);
        }


        [HttpPut("editAdminEmail")]
        public async Task<IActionResult> EditAdminEmail(string id, [FromBody] UpdateAdminEmailDTO emailDto)
        {
            var admin = await _context.Users.FindAsync(id);

            if (admin == null)
            {
                return NotFound("Admin not found.");
            }

         
            var existingEmail = await _context.Users.FirstOrDefaultAsync(u => u.Email == emailDto.Email && u.Id != id);
            if (existingEmail != null)
            {
                return BadRequest("This email is already in use.");
            }

            admin.Email = emailDto.Email;

            _context.Users.Update(admin);
            await _context.SaveChangesAsync();

            return Ok(new { Email = admin.Email });
        }
        [HttpPut("changePassword")]
        public async Task<IActionResult> ChangePassword(string id, [FromBody] ChangePasswordDTO passwordDto)
        {
            var admin = await _context.Users.FindAsync(id);

            if (admin == null)
            {
                return NotFound("Admin not found.");
            }

            if (string.IsNullOrEmpty(admin.PasswordHash))
            {
                return BadRequest("This admin does not have a password set.");
            }

            var passwordHasher = new PasswordHasher<ApplicationUser>();
            var verificationResult = passwordHasher.VerifyHashedPassword(admin, admin.PasswordHash, passwordDto.OldPassword);

            if (verificationResult == PasswordVerificationResult.Failed)
            {
                return BadRequest("Old password is incorrect.");
            }

            admin.PasswordHash = passwordHasher.HashPassword(admin, passwordDto.NewPassword);

            _context.Users.Update(admin);
            await _context.SaveChangesAsync();

            return Ok("Password changed successfully.");
        }


        [HttpGet("getAdminById/{id}")]
        public async Task<IActionResult> GetAdminById(string id)
        {
            var admin = await _context.Users.FindAsync(id);

            if (admin == null)
            {
                return NotFound("Admin not found.");
            }

            var adminDto = mapper.Map<AdminDTO>(admin);
            return Ok(adminDto);
        }


    }
}


