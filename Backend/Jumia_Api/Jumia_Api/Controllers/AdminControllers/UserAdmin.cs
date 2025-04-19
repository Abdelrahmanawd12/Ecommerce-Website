using AutoMapper;
using Jumia.Models;
using Jumia_Api.DTOs.AdminDTOs;
using Jumia_Api.DTOs.SellerDTOs;
using Jumia_Api.UnitOFWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Jumia_Api.Controllers.AdminControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAdmin : ControllerBase
    {


            private readonly IMapper mapper;
            private readonly UserManager<ApplicationUser> userManager;

            public UserAdmin(IMapper _mapper, UserManager<ApplicationUser> _userManager)
            {
                this.mapper = _mapper;
                this.userManager = _userManager;
            }

            [HttpGet("adminInfo")] 
            [ProducesResponseType(200, Type = typeof(AdminDTO))]
            [ProducesResponseType(404)]
            [ProducesResponseType(400)]
            public async Task<IActionResult> GetAdmin(string id)
            {
                var admin = await userManager.FindByIdAsync(id);  

                if (admin == null)
                {
                    return NotFound("Admin not found.");
                }

                var adminDto = mapper.Map<AdminDTO>(admin); 
                return Ok(adminDto);
            }

            [HttpPut("editAdmin")] 
            [ProducesResponseType(200, Type = typeof(void))]
            [ProducesResponseType(404)]
            [ProducesResponseType(400)]
            public async Task<IActionResult> EditAdmin(string id, [FromBody] AdminDTO adminDto)
            {
                var admin = await userManager.FindByIdAsync(id); 

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

                var result = await userManager.UpdateAsync(admin);

                if (!result.Succeeded)
                {
                    return BadRequest("Failed to update admin.");
                }

                var updatedDto = mapper.Map<AdminDTO>(admin);
                return Ok(updatedDto);
            }

            [HttpPatch("updatePassword")]
            [ProducesResponseType(200, Type = typeof(void))]
            [ProducesResponseType(404)]
            [ProducesResponseType(400)]
            public async Task<IActionResult> UpdateAdminPassword(string id, [FromBody] UpdatePasswordDTO passwordDto)
            {
                var admin = await userManager.FindByIdAsync(id);

                if (admin == null)
                {
                    return NotFound("Admin not found.");
                }

                if (string.IsNullOrWhiteSpace(passwordDto.OldPassword) || string.IsNullOrWhiteSpace(passwordDto.NewPassword))
                {
                    return BadRequest("Old and new passwords are required.");
                }

                var result = await userManager.ChangePasswordAsync(admin, passwordDto.OldPassword, passwordDto.NewPassword);

                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description);
                    return BadRequest(new { success = false, message = "Password update failed.", errors = errors });
                }

                return Ok(new { success = true, message = "Password updated successfully." });
            }
        }
    }


