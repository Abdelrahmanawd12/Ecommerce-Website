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

            var now = DateTime.Now;
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

        //----------------------------------------------------------------------
        [HttpGet("/averageOrderValue")]
        public IActionResult GetAverageOrderValue(string sellerId)
        {
            if (string.IsNullOrWhiteSpace(sellerId))
                return BadRequest("SellerId is required.");

            var orders = unit.OrderRepository.GetAll()
                            .Where(o => o.SellerId == sellerId && o.OrderStatus == "Delivered")
                            .ToList();

            if (!orders.Any())
                return Ok(0);

            var totalRevenue = orders.Sum(o => o.TotalAmount);
            var orderCount = orders.Count;

            var averageOrderValue = totalRevenue / orderCount;

            return Ok(averageOrderValue);
        }

        //-----------------------------------------------------------------------------
        [HttpGet("/salesOverTime")]
        public IActionResult GetSalesOverTime(string sellerId)
        {
            if (string.IsNullOrWhiteSpace(sellerId))
                return BadRequest("SellerId is required.");

            var orders = unit.OrderRepository.GetAll()
                            .Where(o => o.SellerId == sellerId && o.OrderStatus == "Delivered")
                            .ToList();

            var grouped = orders
                .GroupBy(o => o.OrderDate.Date)
                .Select(g => new SalesOverTimeDTO
                {
                    Date = g.Key,
                    TotalSales = g.Sum(o => o.TotalAmount)
                })
                .OrderBy(g => g.Date)
                .ToList();

            return Ok(grouped);
        }
        //--------------------------------------------------------------------------------
        [HttpGet("/lowStockProducts")]
        public IActionResult GetLowStockProducts(string sellerId)
        {
            if (string.IsNullOrWhiteSpace(sellerId))
                return BadRequest("SellerId is required.");

            var lowStockThreshold = 5;

            var products = unit.ProductsRepository.GetAll()
                             .Where(p => p.SellerId == sellerId && p.Quantity <= lowStockThreshold)
                             .Select(p => new LowStockProductDTO
                             {
                                 ProductName = p.Name,
                                 QuantityLeft = p.Quantity
                             })
                             .ToList();

            return Ok(products);
        }
        //--------------------------------------------------------------------
        //Reports
        [HttpGet("/topSellingProducts")]
        public IActionResult GetTopSellingProducts(string sellerId)
        {
            var topProducts = unit.OrderItemRepository.GetAll()
                .Where(i => i.Order.SellerId == sellerId && i.Order.OrderStatus == "Delivered")
                .GroupBy(i => i.ProductId)
                .Select(g => new {
                    ProductId = g.Key,
                    TotalQuantity = g.Sum(i => i.Quantity),
                    ProductName = g.First().Product.Name
                })
                .OrderByDescending(x => x.TotalQuantity)
                .Take(5)
                .ToList();

            return Ok(topProducts);
        }
        //-------------------------------------------------------------------------
        [HttpGet("/ordersSummary")]
        public IActionResult GetOrdersSummary(string sellerId)
        {
            var now = DateTime.UtcNow;

            var orders = unit.OrderRepository.GetAll()
                .Where(o => o.SellerId == sellerId);

            var result = new
            {
                Today = orders.Count(o => o.OrderDate.Date == now.Date),
                Weekly = orders.Count(o => o.OrderDate >= now.AddDays(-7)),
                Monthly = orders.Count(o => o.OrderDate >= now.AddMonths(-1))
            };

            return Ok(result);
        }

        //----------------------------------------------------------------------------------
        [HttpGet("/customerInsights")]
        public IActionResult GetCustomerInsights(string sellerId)
        {
            var orders = unit.OrderRepository.GetAll()
                .Where(o => o.SellerId == sellerId && o.OrderStatus == "Delivered")
                .ToList();

            var totalCustomers = orders.Select(o => o.CustomerId).Distinct().Count();

            var topCustomers = orders
                .Where(o => o.Customer != null)
                .GroupBy(o => o.CustomerId)
                .Select(g => new {
                    CustomerFirstName = g.First().Customer.FirstName,
                    CustomerLastName = g.First().Customer.LastName,
                    OrdersCount = g.Count()
                })
                .OrderByDescending(x => x.OrdersCount)
                .Take(5)
                .ToList();

            return Ok(new
            {
                TotalCustomers = totalCustomers,
                TopCustomers = topCustomers
            });
        }


        //--------------------------------------------------------------------------------------
        [HttpGet("/returnReport")]
        public IActionResult GetReturnReport(string sellerId)
        {
            var returnedOrders = unit.OrderRepository.GetAll()
                .Where(o => o.SellerId == sellerId && o.OrderStatus == "Returned")
                .SelectMany(o => o.OrderItems)
                .GroupBy(i => i.ProductId)
                .Select(g => new {
                    ProductId = g.Key,
                    ReturnCount = g.Count(),
                    ProductName = g.First().Product.Name
                })
                .OrderByDescending(x => x.ReturnCount)
                .Take(5)
                .ToList();

            return Ok(returnedOrders);
        }
        //---------------------------------------------------------------------
        [HttpGet("/salesTiming")]
        public IActionResult GetSalesTiming(string sellerId)
        {
            var orders = unit.OrderRepository.GetAll()
                .Where(o => o.SellerId == sellerId && o.OrderStatus == "Delivered");

            var bestDays = orders
                .GroupBy(o => o.OrderDate.DayOfWeek)
                .Select(g => new {
                    Day = g.Key.ToString(),
                    TotalOrders = g.Count()
                }).OrderByDescending(x => x.TotalOrders).ToList();

            var bestHours = orders
                .GroupBy(o => o.OrderDate.Hour)
                .Select(g => new {
                    Hour = g.Key,
                    TotalOrders = g.Count()
                }).OrderByDescending(x => x.TotalOrders).ToList();

            return Ok(new { BestDays = bestDays, BestHours = bestHours });
        }



    }
}