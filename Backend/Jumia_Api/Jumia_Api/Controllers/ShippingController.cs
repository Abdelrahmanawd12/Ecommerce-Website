using Jumia_Api.DTOs.ShippingDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Jumia_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShippingController : ControllerBase
    {
        [HttpPost("/shipping/create")]
        public IActionResult CreateShipment([FromBody] ShippingRequestDto request)
        {
            var response = new
            {
                trackingNumber = $"EZP{new Random().Next(100000, 999999)}",
                estimatedDelivery = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-dd"),
                carrier = "FedEx",
                status = "Order Created"
            };

            return Ok(response);
        }


    }
}
