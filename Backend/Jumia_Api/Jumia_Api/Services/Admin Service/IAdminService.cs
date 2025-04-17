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
            Task<AdminDTO> AddUserAsync(CreateUserDTO userDto);
            Task<AdminDTO> UpdateUserAsync(AdminDTO userDto);

           
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

      
            Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync(); 
            Task<CategoryDTO> GetCategoryByIdAsync(int categoryId); 
            Task<CategoryDTO> AddCategoryAsync(CategoryDTO categoryDto); 
            Task<bool> UpdateCategoryAsync(int categoryId, CategoryDTO categoryDto); 
            Task<bool> DeleteCategoryAsync(int categoryId);

            
            Task<IEnumerable<SubCategoryDTO>> GetAllSubCategoriesAsync(); 
            Task<SubCategoryDTO> GetSubCategoryByIdAsync(int subCategoryId); 
            Task<SubCategoryDTO> AddSubCategoryAsync(SubCategoryDTO subCategoryDto);
            Task<bool> UpdateSubCategoryAsync(int subCategoryId, SubCategoryDTO subCategoryDto); 
            Task<bool> DeleteSubCategoryAsync(int subCategoryId);
        }
    }


