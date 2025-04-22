using Jumia.Models;
using Jumia_Api.DTOs.AdminDTOs;
using Jumia_Api.DTOs.CustomerDTOs;
using Jumia_Api.Services.Admin_Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jumia_Api.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // Orders Endpoints
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
        // Users Endpoints
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminService.GetAllUsersAsync();

            if (users == null || !users.Any())
            {
                return Ok(new List<AdminDTO>());
            }

            return Ok(users);
        }

        [HttpGet("users/{userId}")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            var user = await _adminService.GetUserByIdAsync(userId);

            if (user == null)
            {
                return NotFound(new { message = "User not found with the provided ID." });
            }

            return Ok(user);
        }

        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var result = await _adminService.DeleteUserAsync(userId);

            if (!result)
            {
                return NotFound(new { message = "User not found." });
            }

            return NoContent();
        }

        [HttpPost("add-user")]
        public async Task<IActionResult> AddUser([FromBody] CreateUserDTO userDto)
        {
           
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
              
                var addedUser = await _adminService.AddUserAsync(userDto);

                if (addedUser == null)
                {
                    return BadRequest(new
                    {
                        Success = false,
                        Message = "Failed to add the user. Please check the provided data."
                    });
                }

                return CreatedAtAction(
                    actionName: nameof(GetUserById),
                    routeValues: new { userId = addedUser.Id },
                    value: new
                    {
                        Success = true,
                        UserId = addedUser.Id,
                        Message = "User added successfully"
                    });
            }
            catch (Exception ex)
            {
              
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while adding the user",
                    Error = ex.Message
                });
            }
        }
        [HttpPut("update-user")]
        public async Task<IActionResult> UpdateUser([FromBody] AdminDTO userDto)
        {
            if (userDto == null)
            {
                return BadRequest("User data is required.");
            }

            var updatedUser = await _adminService.UpdateUserAsync(userDto);

            if (updatedUser == null)
            {
                return NotFound(new { message = "User not found with the provided ID." });
            }

            return Ok(updatedUser);
        }

        // Dashboard Stats
        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _adminService.GetDashboardStatsAsync();

            if (stats == null)
            {
                return NotFound("Unable to fetch dashboard stats.");
            }

            return Ok(stats);
        }

        // Products Endpoints
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

        // Category Endpoints
        [HttpGet("categories")]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _adminService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("categories/{categoryId}")]
        public async Task<IActionResult> GetCategoryById(int categoryId)
        {
            var category = await _adminService.GetCategoryByIdAsync(categoryId);

            if (category == null)
            {
                return NotFound($"Category with ID {categoryId} not found.");
            }

            return Ok(category);
        }

        [HttpPost("categories")]
        public async Task<IActionResult> AddCategoryWithSubCategory([FromBody] adminCategoryDTO categoryDto)
        {
            try
            {
                if (categoryDto == null)
                {
                    return BadRequest(new { success = false, message = "Category data is required" });
                }

                var result = await _adminService.AddCategoryAsync(categoryDto);

                return Ok(new
                {
                    success = true,
                    message = "Category added successfully",
                    data = result
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, new { success = false, message = "An error occurred while adding the category" });
            }
        }

       
       
        [HttpPut("categories/{categoryId}")]
        public async Task<IActionResult> UpdateCategory(int categoryId, [FromBody] adminCategoryDTO categoryDto)
        {
            if (categoryDto == null)
            {
                return BadRequest("Category data is required.");
            }

            var result = await _adminService.UpdateCategoryAsync(categoryId, categoryDto);

            if (!result)
            {
                return NotFound($"Category with ID {categoryId} not found.");
            }

            return NoContent();
        }

        [HttpDelete("categories/{categoryId}")]
        public async Task<IActionResult> DeleteCategory(int categoryId)
        {
            var result = await _adminService.DeleteCategoryAsync(categoryId);

            if (!result)
            {
                return NotFound($"Category with ID {categoryId} not found.");
            }

            return NoContent();
        }

        [HttpPost("add-subcategory")]
        public async Task<IActionResult> AddSubcategory([FromBody] SubCatDTO subCatDto)
        {
            if (subCatDto == null)
                return BadRequest(new { message = "Invalid subcategory data." });

             if (string.IsNullOrWhiteSpace(subCatDto.SubCatName))
                return BadRequest(new { message = "Subcategory name is required."
                });

            if (string.IsNullOrWhiteSpace(subCatDto.CategoryName))
                return BadRequest(new { message = "Category name is required." });

            var result = await _adminService.AddSubcategoryAsync(subCatDto);

            if (result)
                return Ok(new { message = "Subcategory added successfully." });
            else
                return BadRequest(new { message = "Failed to add subcategory. The category may not exist, or the subcategory name is already used." });
        }

    }
}
