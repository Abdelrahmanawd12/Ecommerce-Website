//using Easypost;
//using EasyPost.Models.API;
//using Jumia.Models;
//using Jumia_Api.DTOs.ShippingDTOs;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Newtonsoft.Json;
//using System.Text;

//namespace Jumia_Api.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class ShippingController : ControllerBase
//    {
//        private readonly HttpClient _httpClient;

//        public ShippingController()
//        {
//            // Corrected the usage of EasyPost.ClientManager  
//            EasyPost.ClientManager clientManager = new EasyPost.ClientManager("YOUR_EASYPOST_API_KEY");
//        }

//        [HttpPost("/shipping/create")]
//        public async Task<IActionResult> CreateShipment([FromBody] ShippingRequestDto request)
//        {
//            try
//            {
//                var fromAddress = new Address
//                {
//                    Street1 = "123 Main St",
//                    City = "San Francisco",
//                    State = "CA",
//                    Zip = "94105",
//                    Country = "US"
//                };

//                var toAddress = new Address
//                {
//                    Street1 = request.Address,
//                    City = request.City,
//                    State = request.State,
//                    Zip = request.ZipCode,
//                    Country = "US"
//                };

//                var shipment = new Shipment
//                {
//                    FromAddress = fromAddress,
//                    ToAddress = toAddress,
//                    Parcel = new Parcel
//                    {
//                        Length = 10,
//                        Width = 10,
//                        Height = 10,
//                        Weight = 20.0
//                    }
//                };

//                await shipment.CreateAsync();

//                var response = new
//                {
//                    trackingNumber = shipment.TrackingCode,
//                    estimatedDelivery = shipment.EstimatedDeliveryDate?.ToString("yyyy-MM-dd") ?? "N/A",
//                    carrier = shipment.ShippingCarrier,
//                    status = "Order Created"
//                };

//                return Ok(response);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new { message = "Failed to create shipment", error = ex.Message });
//            }
//        }
//    }
//}
