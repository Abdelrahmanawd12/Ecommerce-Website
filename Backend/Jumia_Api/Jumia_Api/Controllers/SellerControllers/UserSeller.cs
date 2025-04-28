using AutoMapper;
using Jumia.Models;
using Jumia_Api.DTOs.SellerDTOs;
using Jumia_Api.UnitOFWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Jumia_Api.Controllers.SellerControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserSeller : ControllerBase
    {
        UnitOFWork unit;
        IMapper mapper;
        private readonly UserManager<ApplicationUser> userManager;
        public UserSeller(UnitOFWork _unit,IMapper _mapper, UserManager<ApplicationUser> _userManager) {
            this.unit = _unit;
            this.mapper = _mapper;
            this.userManager = _userManager;
        }

        //Get Seller Information using seller ID
        [HttpGet("sellerInfo")] // api/UserSeller/sellerInfo?id=1
        [ProducesResponseType(200, Type = typeof(sellerDTO))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [EndpointSummary("Get Specific Seller")]
        [EndpointDescription("Get Seller by Seller Id")]
        public IActionResult GetSeller(string id)
        {
            var seller = unit.SellerRepository.GetSellerById(id);

            if (seller == null)
            {
                return NotFound("Seller not found.");
            }

            var sellerDto = mapper.Map<sellerDTO>(seller);
            return Ok(sellerDto);
        }

        //Update Seller Information using SellerId
        [HttpPut("editSeller")] // api/UserSeller/editSeller?id=someId
        [ProducesResponseType(200, Type = typeof(void))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Edit Seller data")]
        [EndpointDescription("Edit Seller data by Seller Id")]
        public IActionResult EditSeller(string id, [FromBody] sellerDTO sellerdto)
        {
            var seller = unit.SellerRepository.GetSellerById(id);
            Console.WriteLine($"Incoming Phone in DTO: {sellerdto.Phone}");
            Console.WriteLine($"Incoming DOB in DTO: {sellerdto.DOB}");

            if (seller == null)
            {
                return NotFound("Seller not found.");
            }
            Console.WriteLine($"PhoneNumber before mapping: {seller.PhoneNumber}");
            Console.WriteLine($"dateOfBirth before mapping: {seller.DateOfBirth}");
            mapper.Map(sellerdto, seller);

            unit.SellerRepository.Update(seller);
            unit.Save();

            var updatedDto = mapper.Map<sellerDTO>(seller);
            return Ok(updatedDto);
        }

        //Update Seller Password only 
        [HttpPatch("updatePassword")]
        [ProducesResponseType(200,Type =typeof(void))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Update seller password")]
        [EndpointDescription("Update seller password by seller Id")]
        public async Task<IActionResult> UpdateSellerPassword(string id, [FromBody] UpdatePasswordDTO passwordDto)
        {
            var seller = await userManager.FindByIdAsync(id);
            if (seller == null)
            {
                return NotFound("Seller not found.");
            }

            if (string.IsNullOrWhiteSpace(passwordDto.OldPassword) || string.IsNullOrWhiteSpace(passwordDto.NewPassword))
            {
                return BadRequest("Old and new passwords are required.");
            }

            var result = await userManager.ChangePasswordAsync(seller, passwordDto.OldPassword, passwordDto.NewPassword);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                Console.WriteLine(string.Join(", ", errors)); // Log the exact error
                return BadRequest(new { success = false, message = "Password update failed.", errors = errors });
            }

            return Ok(new { success = true, message = "Password updated successfully." });
        }

        //---------------------------------------------------------------------------------------
        //Get Seller Id , Name for ProductRequests 
        [HttpGet("/sellerName")]
        [ProducesResponseType(200, Type = typeof(void))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Get Seller Name")]
        [EndpointDescription("Get Seller Name By product Id For Admin Dashboard")]

        public IActionResult GetSeller(int productId)
        {
            try
            {
                var product = unit.ProductsRepository.GetById(productId);
                if (product == null)
                {
                    return NotFound("Product not found.");
                }

                var seller = unit.SellerRepository.GetSellerById(product.SellerId);
                if (seller == null)
                {
                    return NotFound("Seller not found.");
                }

                return Ok(seller.FirstName+" "+seller.LastName); 
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }


    }
}
