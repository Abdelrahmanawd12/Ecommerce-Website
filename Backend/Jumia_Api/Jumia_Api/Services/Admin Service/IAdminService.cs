using Jumia.Models;
using Jumia_Api.DTOs.AdminDTOs;
using Jumia_Api.DTOs.CustomerDTOs;

namespace Jumia_Api.Services.Admin_Service
{
    public interface IAdminService
    {
       
            Task<IEnumerable<AdminDTO>> GetAllUsersAsync();
            Task<AdminDTO> GetUserByIdAsync(string userId);
            Task<bool> DeleteUserAsync(string userId);
            Task<IEnumerable<AdminOrderDTO>> GetAllOrdersAsync();
            Task<AdminOrderDTO> GetOrderByIdAsync(int orderId);
            Task<bool> UpdateOrderStatusAsync(int orderId, string newStatus);
            Task<AdminDashboardDTO> GetDashboardStatsAsync();
        Task<bool> AddOrderAsync(Order order);
        Task<bool> DeleteOrderAsync(int orderId);

        Task<IEnumerable<ProductsDTO>> GetAllProductsAsync();
        Task<ProductsDTO> GetProductByIdAsync(int productId);
        Task<bool> AddProductAsync(ProductsDTO productDto);
        Task<bool> UpdateProductAsync(ProductsDTO productDto);
        Task<bool> DeleteProductAsync(int productId);
    }

    }
