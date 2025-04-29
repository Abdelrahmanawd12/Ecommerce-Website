using Jumia.Data;
using Jumia_Api.DTOs.CustomerDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jumia_Api.Controllers.CustomerControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly JumiaDbContext _context;

        // Constructor to inject the DbContext
        public OrdersController(JumiaDbContext context)
        {
            _context = context;
        }


        // 🔍 GET: Order Details by ID
        [HttpGet("customer/{customerId}/status/{category}")]
        //GetOrdersByStatusCategory        Some DATA
        public IActionResult GetOrdersByStatusCategory(string customerId, string category)
        {
            List<string> statusGroup;

            if (category.Equals("current", StringComparison.OrdinalIgnoreCase))
            {
                statusGroup = new List<string> { "Pending", "processing", "shipped", "delivered" };
            }
            else if (category.Equals("past", StringComparison.OrdinalIgnoreCase))
            {
                statusGroup = new List<string> { "cancelled", "returned" };
            }
            else
            {
                return BadRequest("Invalid status category");
            }

            var orders = _context.Orders
                .Where(o => o.CustomerId == customerId && statusGroup.Contains(o.OrderStatus.ToLower()))
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                        .ThenInclude(p => p.ProductImages)
                .ToList();

            if (!orders.Any())
                return NotFound("No orders found for this status category");

            var result = orders.Select(order => new OrderListDto
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate,
                OrderStatus = order.OrderStatus,
                Items = order.OrderItems.Select(oi => new OrderItemSummaryDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product?.Name,
                    ProductImageUrl = oi.Product?.ProductImages?.FirstOrDefault()?.Url
                }).ToList()
            }).ToList();

            return Ok(result);
        }



        [HttpGet("{id}")]
        public IActionResult GetOrderDetails(int id)
        {
            var order = _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                        .ThenInclude(p => p.ProductImages)
                .FirstOrDefault(o => o.OrderId == id);

            if (order == null) return NotFound();

            var orderDto = new OrderDetailsDto
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate,
                OrderStatus = order.OrderStatus,
                PaymentMethod = order.PaymentMethod,
                PaymentStatus = order.PaymentStatus,
                ShippingAddress = order.ShippingAddress,
                TotalAmount = order.TotalAmount,
                OrderTrackingNumber = order.OrderTrackingNumber,
                Items = order.OrderItems.Select(oi => new OrderItemDto
                {
                    ProductName = oi.Product.Name,
                    ProductImageUrl = oi.Product.ProductImages.FirstOrDefault().Url,
                    Quantity = oi.Quantity,
                    SubTotal = oi.SubTotal
                }).ToList()
            };

            return Ok(orderDto);
        }



        // ❌ POST: Cancel an order (only if status is ONGOING)
        [HttpPost("{id}/cancel")]
        public IActionResult CancelOrder(int id)
        {
            var order = _context.Orders.FirstOrDefault(o => o.OrderId == id);

            if (order == null)
                return NotFound(new { message = "Order not found" });

            if (order.OrderStatus != "Pending")
                return BadRequest(new { message = "Only ongoing orders can be canceled" });

            order.OrderStatus = "cancelled";
            order.PaymentStatus = "cancelled";
            _context.SaveChanges();

            return Ok(new { message = "Order canceled successfully" });
        }

    }
}