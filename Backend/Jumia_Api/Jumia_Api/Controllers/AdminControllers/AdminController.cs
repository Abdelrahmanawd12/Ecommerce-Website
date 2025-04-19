using Jumia.Models;
using Jumia_Api.DTOs.AdminDTOs;
using Jumia_Api.DTOs.CustomerDTOs;
using Jumia_Api.Services.Admin_Service;
using Microsoft.AspNetCore.Mvc;

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
                return NotFound();
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
            if (userDto == null)
            {
                return BadRequest("User data is required.");
            }

            var addedUser = await _adminService.AddUserAsync(userDto);

            if (addedUser == null)
            {
                return BadRequest("Failed to add the user.");
            }

            return CreatedAtAction(nameof(GetUserById), new { userId = addedUser.Id }, addedUser);
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
                return NotFound("User not found.");
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
        public async Task<IActionResult> AddCategory([FromBody] CategoryDTO categoryDto)
        {
            if (categoryDto == null)
            {
                return BadRequest("Category data is required.");
            }

            var addedCategory = await _adminService.AddCategoryAsync(categoryDto);

            if (addedCategory == null)
            {
                return BadRequest("Category could not be added.");
            }

            return CreatedAtAction(nameof(GetCategoryById), new { categoryId = addedCategory.Id }, addedCategory);
        }

        [HttpPut("categories/{categoryId}")]
        public async Task<IActionResult> UpdateCategory(int categoryId, [FromBody] CategoryDTO categoryDto)
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

        // SubCategory Endpoints
        [HttpGet("subcategories")]
        public async Task<IActionResult> GetAllSubCategories()
        {
            var subCategories = await _adminService.GetAllSubCategoriesAsync();
            return Ok(subCategories);
        }

        [HttpGet("subcategories/{subCategoryId}")]
        public async Task<IActionResult> GetSubCategoryById(int subCategoryId)
        {
            var subCategory = await _adminService.GetSubCategoryByIdAsync(subCategoryId);

            if (subCategory == null)
            {
                return NotFound($"SubCategory with ID {subCategoryId} not found.");
            }

            return Ok(subCategory);
        }

        [HttpPost("subcategories")]
        public async Task<IActionResult> AddSubCategory([FromBody] SubCategoryDTO subCategoryDto)
        {
            if (subCategoryDto == null)
            {
                return BadRequest("SubCategory data is required.");
            }

            var addedSubCategory = await _adminService.AddSubCategoryAsync(subCategoryDto);

            if (addedSubCategory == null)
            {
                return NotFound("Category not found.");
            }

            return CreatedAtAction(nameof(GetSubCategoryById), new { subCategoryId = addedSubCategory.SubCatId }, addedSubCategory);
        }

        [HttpPut("subcategories/{subCategoryId}")]
        public async Task<IActionResult> UpdateSubCategory(int subCategoryId, [FromBody] SubCategoryDTO subCategoryDto)
        {
            if (subCategoryDto == null)
            {
                return BadRequest("SubCategory data is required.");
            }

            var result = await _adminService.UpdateSubCategoryAsync(subCategoryId, subCategoryDto);

            if (!result)
            {
                return NotFound($"SubCategory with ID {subCategoryId} not found.");
            }

            return NoContent();
        }

        [HttpDelete("subcategories/{subCategoryId}")]
        public async Task<IActionResult> DeleteSubCategory(int subCategoryId)
        {
            var result = await _adminService.DeleteSubCategoryAsync(subCategoryId);

            if (!result)
            {
                return NotFound($"SubCategory with ID {subCategoryId} not found.");
            }

            return NoContent();
        }
    }
}
