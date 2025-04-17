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
    public class SalesController : ControllerBase
    {
        UnitOFWork unit;
        IMapper mapper;

        public SalesController(UnitOFWork _unit, IMapper _mapper)
        {
            this.unit = _unit;
            this.mapper = _mapper;
        }

        //Get Product Sales
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Get Product Sales")]
        [EndpointDescription("Returns total sales (quantity) per product")]
        [HttpGet("/productSales")]
        public IActionResult GetProductSales()
        {
            var orderItems = unit.OrderItemRepository.GetAll();

            if (orderItems == null || !orderItems.Any())
            {
                return NotFound("No order items found.");
            }

            var salesData = orderItems
                .GroupBy(oi => new { oi.ProductId, oi.Product.Name })
                .Select(g => new productSalesDTO
                {
                    ProductName = g.Key.Name,
                    Sales = g.Sum(oi => oi.Quantity)
                })
                .ToList();

            return Ok(salesData);
        }

        //----------------------------------------------------------------------

        [HttpGet("/profits")]
        [ProducesResponseType(200, Type = typeof(SellerProfitDTO))]
        [ProducesResponseType(400)]
        [EndpointSummary("Get Seller Profits")]
        [EndpointDescription("Get total profits for a seller in the last week, month, and 6 months, after removing product costs.")]
        public IActionResult GetSellerProfits(string sellerId)
        {
            if (string.IsNullOrWhiteSpace(sellerId))
            {
                return BadRequest("SellerId is required.");
            }

            var allOrders = unit.OrderRepository.GetAll()
                                 .Where(o => o.SellerId == sellerId && o.OrderStatus == "Delivered")
                                 .ToList();

            if (allOrders == null || !allOrders.Any())
            {
                return Ok(new SellerProfitDTO { WeeklyProfit = 0, MonthlyProfit = 0, HalfYearProfit = 0 });
            }

            var now = DateTime.UtcNow;
            decimal costRate = 0.3m;

            decimal CalculateProfit(DateTime fromDate) =>
                allOrders
                    .Where(o => o.OrderDate >= fromDate)
                    .Sum(o => o.TotalAmount * (1 - costRate));

            var dto = new SellerProfitDTO
            {
                WeeklyProfit = CalculateProfit(now.AddDays(-7)),
                MonthlyProfit = CalculateProfit(now.AddMonths(-1)),
                HalfYearProfit = CalculateProfit(now.AddMonths(-6))
            };

            return Ok(dto);
        }


    }
}
