using Jumia.Data;
using Jumia.Models;
using Jumia_Api.DTOs.AdminDTOs;
using Jumia_Api.DTOs.CustomerDTOs;
using Jumia_Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Jumia_Api.Services.Admin_Service
{
    public class AdminService : IAdminService
    {
        private readonly JumiaDbContext _context;

        public AdminService(JumiaDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AdminOrderDTO>> GetAllOrdersAsync()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .Include(o => o.Customer)
                .ToListAsync();

            return orders.Select(o => new AdminOrderDTO
            {
                OrderId = o.OrderId,
                Status = o.OrderStatus,
                OrderDate = o.OrderDate,
                TotalAmount = o.TotalAmount,
                CustomerName = o.Customer.FirstName + " " + o.Customer.LastName,
                Products = o.OrderItems.Select(oi => oi.Product.Name).ToList()
            }).ToList();
        }


        public async Task<AdminOrderDTO> GetOrderByIdAsync(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .Include(o => o.Customer)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null)
            {
                return null;
            }

            return new AdminOrderDTO
            {
                OrderId = order.OrderId,
                Status = order.OrderStatus,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                CustomerName = order.Customer.FirstName + " " + order.Customer.LastName,
                Products = order.OrderItems.Select(oi => oi.Product.Name).ToList()
            };
        }


        public async Task<IEnumerable<AdminDTO>> GetAllUsersAsync()
        {
            var users = await _context.Users
                .Where(u => u.Role != null)
                .ToListAsync();

            return users.Select(u => new AdminDTO
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Role = u.Role
            }).ToList();
        }


        public async Task<AdminDTO> GetUserByIdAsync(string userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return null;
            }

            return new AdminDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role
            };
        }


        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return false;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<AdminDashboardDTO> GetDashboardStatsAsync()
        {
            var totalOrders = await _context.Orders.CountAsync();
            var totalUsers = await _context.Users.CountAsync();
            var totalSales = await _context.Orders.SumAsync(o => o.TotalAmount);

            return new AdminDashboardDTO
            {
                TotalOrders = totalOrders,
                TotalUsers = totalUsers,
                TotalSales = totalSales
            };
        }


        public async Task<bool> AddOrderAsync(Order order)
        {
            if (order == null)
            {
                return false;
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateOrderStatusAsync(int orderId, string newStatus)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null)
            {
                return false;
            }

            order.OrderStatus = newStatus;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteOrderAsync(int orderId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);
            if (order == null)
            {
                return false;
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }



        public async Task<IEnumerable<ProductsDTO>> GetAllProductsAsync()
        {
            var products = await _context.Products
                .Include(p => p.SubCategory)
                .Include(p => p.ProductImages)
                .Include(p => p.ProductTags)
                .ToListAsync();

            return products.Select(p => new ProductsDTO
            {
                ProductId = p.ProductId,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                SubCategoryName = p.SubCategory?.SubCatName,
                Quantity = p.Quantity,
                Brand = p.Brand,
                ImageUrls = p.ProductImages?.Select(img => img.Url).ToList() ?? new List<string>(),
                Tags = p.ProductTags?.Select(tag => tag.Tag).ToList() ?? new List<string>(),
                Discount = p.Discount,
                Weight = p.Weight
            }).ToList();
        }



        public async Task<ProductsDTO> GetProductByIdAsync(int productId)
        {
            var product = await _context.Products
                .Include(p => p.SubCategory)
                .Include(p => p.ProductImages)
                .Include(p => p.ProductTags)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null) return null;

            return new ProductsDTO
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                SubCategoryName = product.SubCategory?.SubCatName,
                Quantity = product.Quantity,
                Brand = product.Brand,
                ImageUrls = product.ProductImages?.Select(img => img.Url).ToList() ?? new List<string>(),
                Tags = product.ProductTags?.Select(tag => tag.Tag).ToList() ?? new List<string>(),
                Discount = product.Discount,
                Weight = product.Weight
            };
        }
        public async Task<bool> AddProductAsync(ProductsDTO productDto)
        {
            if (productDto == null) return false;

            var product = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                SubCategoryId = _context.SubCategories
                            .FirstOrDefault(sc => sc.SubCatName == productDto.SubCategoryName)?.SubCatId ?? 0,
                Quantity = productDto.Quantity,
                Brand = productDto.Brand,
                Discount = productDto.Discount,
                Weight = productDto.Weight,
                ProductImages = productDto.ImageUrls?.Select(url => new ProductImage { Url = url }).ToList(),
                ProductTags = productDto.Tags?.Select(t => new ProductTag { Tag = t }).ToList()
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateProductAsync(int productId, ProductsDTO updatedProduct)
        {
            var product = await _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.ProductTags)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null) return false;

            product.Name = updatedProduct.Name;
            product.Description = updatedProduct.Description;
            product.Price = updatedProduct.Price;
            product.Quantity = updatedProduct.Quantity;
            product.Brand = updatedProduct.Brand;
            product.Discount = updatedProduct.Discount;
            product.Weight = updatedProduct.Weight;
            var subCategory = await _context.SubCategories
           .FirstOrDefaultAsync(sc => sc.SubCatName == updatedProduct.SubCategoryName);

            if (subCategory != null)
            {
                product.SubCategoryId = subCategory.SubCatId;
            }




            product.ProductImages.Clear();
            product.ProductImages = updatedProduct.ImageUrls?.Select(url => new ProductImage { Url = url }).ToList();

            product.ProductTags.Clear();
            product.ProductTags = updatedProduct.Tags?.Select(tag => new ProductTag { Tag = tag }).ToList();

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteProductAsync(int productId)
        {
            var product = await _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.ProductTags)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null) return false;

            _context.ProductImages.RemoveRange(product.ProductImages);
            _context.ProductTags.RemoveRange(product.ProductTags);
            _context.Products.Remove(product);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateProductAsync(ProductsDTO productDto)
        {
            var product = await _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.ProductTags)
                .FirstOrDefaultAsync(p => p.ProductId == productDto.ProductId);

            if (product == null) return false;


            product.Name = productDto.Name;
            product.Description = productDto.Description;
            product.Price = productDto.Price;
            product.Quantity = productDto.Quantity;
            product.Brand = productDto.Brand;
            product.Discount = productDto.Discount;
            product.Weight = productDto.Weight;


            var subCategory = await _context.SubCategories
          .FirstOrDefaultAsync(sc => sc.SubCatName == productDto.SubCategoryName);

            if (subCategory != null)
            {
                product.SubCategoryId = subCategory.SubCatId;
            }


            _context.ProductImages.RemoveRange(product.ProductImages);
            product.ProductImages = productDto.ImageUrls?
                .Select(url => new ProductImage { Url = url, ProductId = product.ProductId })
                .ToList();

            _context.ProductTags.RemoveRange(product.ProductTags);
            product.ProductTags = productDto.Tags?
                .Select(tag => new ProductTag { Tag = tag, ProductId = product.ProductId })
                .ToList();

            await _context.SaveChangesAsync();
            return true;
        }



    }


}
