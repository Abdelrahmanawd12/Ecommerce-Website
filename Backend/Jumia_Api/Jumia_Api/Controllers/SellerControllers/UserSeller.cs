using AutoMapper;
using Jumia.Models;
using Jumia_Api.DTOs.SellerDTOs;
using Jumia_Api.UnitOFWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Jumia_Api.Controllers.SellerControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserSeller : ControllerBase
    {
        UnitOFWork unit;
        IMapper mapper;
        public UserSeller(UnitOFWork _unit,IMapper _mapper) {
            this.unit = _unit;
            this.mapper = _mapper;
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


    }
}
