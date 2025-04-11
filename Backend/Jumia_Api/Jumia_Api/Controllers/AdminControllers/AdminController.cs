using Jumia.Models;
using Jumia_Api.DTOs.CustomerDTOs;
using Jumia_Api.Services.Admin_Service;
using Microsoft.AspNetCore.Mvc;

[Route("api/admin")]
[ApiController]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

  
    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _adminService.GetAllOrdersAsync();

        if (orders == null || !orders.Any())
        {
            return NotFound("No orders found.");
        }

        return Ok(orders);
    }

   
    [HttpGet("orders/{orderId}")]
    public async Task<IActionResult> GetOrderById(int orderId)
    {
        var order = await _adminService.GetOrderByIdAsync(orderId);

        if (order == null)
        {
            return NotFound("Order not found.");
        }

        return Ok(order);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _adminService.GetAllUsersAsync();

        if (users == null || !users.Any())
        {
            return NotFound("No users found.");
        }

        return Ok(users);
    }

    [HttpGet("users/{userId}")]
    public async Task<IActionResult> GetUserById(string userId)
    {
        var user = await _adminService.GetUserByIdAsync(userId);

        if (user == null)
        {
            return NotFound("User not found.");
        }

        return Ok(user);
    }

    [HttpDelete("users/{userId}")]
    public async Task<IActionResult> DeleteUser(string userId)
    {
        var result = await _adminService.DeleteUserAsync(userId);

        if (!result)
        {
            return NotFound("User not found.");
        }

        return NoContent();
    }


    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var stats = await _adminService.GetDashboardStatsAsync();

        if (stats == null)
        {
            return NotFound("Unable to fetch dashboard stats.");
        }

        return Ok(stats);
    }

 
    [HttpPost("orders")]
    public async Task<IActionResult> AddOrder([FromBody] Order order)
    {
        var result = await _adminService.AddOrderAsync(order);

        if (!result)
        {
            return BadRequest("Failed to add order.");
        }

        return CreatedAtAction(nameof(GetOrderById), new { orderId = order.OrderId }, order);
    }


    [HttpPut("orders/{orderId}")]
    public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] string newStatus)
    {
        var result = await _adminService.UpdateOrderStatusAsync(orderId, newStatus);

        if (!result)
        {
            return BadRequest("Failed to update order status.");
        }

        return NoContent();
    }

   
    [HttpDelete("orders/{orderId}")]
    public async Task<IActionResult> DeleteOrder(int orderId)
    {
        var result = await _adminService.DeleteOrderAsync(orderId);

        if (!result)
        {
            return NotFound("Order not found.");
        }

        return NoContent();
    }

    [HttpGet("products")]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _adminService.GetAllProductsAsync();
        return Ok(products);
    }


    [HttpGet("products/{id}")]
    public async Task<IActionResult> GetProductById(int id)
    {
        var product = await _adminService.GetProductByIdAsync(id);
        if (product == null)
        {
            return NotFound("Product not found.");
        }
        return Ok(product);
    }

    [HttpPut("products/{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductsDTO productDto)
    {
        if (id != productDto.ProductId)
        {
            return BadRequest("Product ID mismatch.");
        }

        var result = await _adminService.UpdateProductAsync(productDto);
        if (!result)
        {
            return NotFound("Product not found.");
        }

        return NoContent();
    }


    [HttpDelete("products/{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var result = await _adminService.DeleteProductAsync(id);
        if (!result)
        {
            return NotFound("Product not found.");
        }
        return NoContent();
    }
}







