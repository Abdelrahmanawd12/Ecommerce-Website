using AutoMapper;
using Jumia.Data;
using Jumia.Models;
using Jumia_Api.DTOs.AdminDTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jumia_Api.Controllers.AdminControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAdmin : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JumiaDbContext _context;

        public UserAdmin(IMapper mapper, UserManager<ApplicationUser> userManager, JumiaDbContext context)
        {
            _mapper = mapper;
            _userManager = userManager;
            _context = context;
        }

        [HttpPut("editAdmin/{id}")]
        public async Task<IActionResult> EditAdmin(string id, [FromBody] AdminDTO adminDto)
        {
            var admin = await _userManager.FindByIdAsync(id);
            if (admin == null || admin.Role != "Admin")
            {
                return NotFound("Admin not found.");
            }

        
            admin.FirstName = adminDto.FirstName;
            admin.LastName = adminDto.LastName;
            admin.DateOfBirth = adminDto.DateOfBirth;
            admin.Gender = adminDto.Gender;

          
            if (admin.Email != adminDto.Email)
            {
                var emailExists = await _userManager.FindByEmailAsync(adminDto.Email);
                if (emailExists != null && emailExists.Id != id)
                {
                    return BadRequest("Email is already in use.");
                }

                admin.Email = adminDto.Email;
                admin.UserName = adminDto.Email;
                admin.NormalizedEmail = adminDto.Email.ToUpper();
                admin.NormalizedUserName = adminDto.Email.ToUpper();
            }

            var result = await _userManager.UpdateAsync(admin);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(_mapper.Map<AdminDTO>(admin));
        }

        [HttpPut("changePassword/{id}")]
        public async Task<IActionResult> ChangePassword(string id, [FromBody] ChangePasswordDTO passwordDto)
        {
            var admin = await _userManager.FindByIdAsync(id);
            if (admin == null || admin.Role != "Admin")
            {
                return NotFound("Admin not found.");
            }

            var result = await _userManager.ChangePasswordAsync(admin, passwordDto.OldPassword, passwordDto.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { Message = "Password changed successfully." });
        }

        [HttpGet("getAdminById/{id}")]
        public async Task<IActionResult> GetAdminById(string id)
        {
            var admin = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id && u.Role == "Admin");

            if (admin == null)
            {
                return NotFound("Admin not found.");
            }

            return Ok(_mapper.Map<AdminDTO>(admin));
        }

        [HttpGet("getAllAdmins")]
        public async Task<IActionResult> GetAllAdmins()
        {
            var admins = await _context.Users
                .AsNoTracking()
                .Where(u => u.Role == "Admin")
                .ToListAsync();

            return Ok(_mapper.Map<List<AdminDTO>>(admins));
        }

        [HttpDelete("deleteAdmin/{id}")]
        public async Task<IActionResult> DeleteAdmin(string id)
        {
            var admin = await _userManager.FindByIdAsync(id);
            if (admin == null || admin.Role != "Admin")
            {
                return NotFound("Admin not found.");
            }

            var result = await _userManager.DeleteAsync(admin);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { Message = "Admin deleted successfully." });
        }
    }
}