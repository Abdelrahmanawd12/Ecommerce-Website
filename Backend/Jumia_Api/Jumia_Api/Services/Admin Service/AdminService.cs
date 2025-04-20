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
                .Where(u => u.Role != null && !u.IsDeleted) 
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
                .FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted); 

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
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);
            if (user == null)
            {
                return false;
            }

            user.IsDeleted = true; 
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<AdminDTO> AddUserAsync(CreateUserDTO userDto)
        {
            if (userDto == null)
            {
                return null;
            }

            var user = new ApplicationUser
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                Role = userDto.Role,
                DateOfBirth = userDto.DateOfBirth ?? DateTime.MinValue,
                CreatedAt = DateTime.Now,
                Gender = userDto.Gender,
                IsDeleted = false
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new AdminDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                DateOfBirth = user.DateOfBirth,
                CreatedAt = user.CreatedAt,
                Gender = user.Gender
            };
        }

        public async Task<AdminDTO> UpdateUserAsync(AdminDTO userDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userDto.Id && !u.IsDeleted);
            if (user == null)
            {
                return null;
            }

            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.Email = userDto.Email;
            user.Role = userDto.Role;
            user.Gender = userDto.Gender;
            user.DateOfBirth = userDto.DateOfBirth;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return new AdminDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                Gender = user.Gender,
                DateOfBirth = user.DateOfBirth
            };
        }

        public async Task<AdminDashboardDTO> GetDashboardStatsAsync()
        {
            var totalCategories = await _context.Categories.CountAsync();
            var totalSubCategories = await _context.SubCategories.CountAsync();
            var totalUsers = await _context.Users.CountAsync();
            var newUsersThisMonth = await _context.Users
                .CountAsync(u => u.CreatedAt.Month == DateTime.Now.Month && u.CreatedAt.Year == DateTime.Now.Year);
            var totalProducts = await _context.Products.CountAsync();
            var outOfStockProducts = await _context.Products.CountAsync(p => p.Quantity == 0);
            var totalSales = await _context.Orders.SumAsync(o => o.TotalAmount);
            var totalCommission = totalSales * 0.1m; 

            return new AdminDashboardDTO
            {
                TotalCategories = totalCategories,
                TotalSubCategories = totalSubCategories,
                TotalUsers = totalUsers,
                NewUsersThisMonth = newUsersThisMonth,
                TotalProducts = totalProducts,
                OutOfStockProducts = outOfStockProducts,
                TotalSales = totalSales,
                TotalCommission = totalCommission
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
        public async Task<adminCategoryDTO> AddCategoryAsync(adminCategoryDTO categoryDto)
        {
            var category = new Category
            {
                CatName = categoryDto.Name,
                SubCategories = categoryDto.Subcategory.Select(sc => new SubCategory
                {
                    SubCatName = sc.SubCatName
                }).ToList()
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            categoryDto.Id = category.CatId;
            return categoryDto;
        }


        public async Task<bool> UpdateCategoryAsync(int categoryId, adminCategoryDTO categoryDto)
        {
            var category = await _context.Categories
                .Include(c => c.SubCategories)
                .FirstOrDefaultAsync(c => c.CatId == categoryId);

            if (category == null)
                return false;

            category.CatName = categoryDto.Name;

            if (categoryDto.Subcategory != null && categoryDto.Subcategory.Any())
            {
                foreach (var subCategoryDto in categoryDto.Subcategory)
                {
                    var subCategory = category.SubCategories
                        .FirstOrDefault(sc => sc.SubCatId == subCategoryDto.SubCatId);

                    if (subCategory != null)
                    {
                        subCategory.SubCatName = subCategoryDto.SubCatName;
                    }
                    else
                    {
                        category.SubCategories.Add(new SubCategory
                        {
                            SubCatName = subCategoryDto.SubCatName
                        });
                    }
                }
            }

            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> DeleteCategoryAsync(int categoryId)
        {
            var category = await _context.Categories
                .Include(c => c.SubCategories)
                .FirstOrDefaultAsync(c => c.CatId == categoryId);

            if (category == null)
            {
                return false;
            }

            
            _context.SubCategories.RemoveRange(category.SubCategories);

          
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<adminCategoryDTO> GetCategoryByIdAsync(int categoryId)
        {
            var category = await _context.Categories
                .Include(c => c.SubCategories)
                .FirstOrDefaultAsync(c => c.CatId == categoryId);

            if (category == null)
                return null;

            return new adminCategoryDTO
            {
                Id = category.CatId,
                Name = category.CatName,
                Subcategory = category.SubCategories.Select(sc => new SubCatDTO
                {
                    SubCatId = sc.SubCatId,
                    SubCatName = sc.SubCatName
                }).ToList()
            };
        }


        public async Task<IEnumerable<adminCategoryDTO>> GetAllCategoriesAsync()
        {
            var categories = await _context.Categories
                .Include(c => c.SubCategories)
                .ToListAsync();

            return categories.Select(c => new adminCategoryDTO
            {
                Id = c.CatId,
                Name = c.CatName,
                Subcategory = c.SubCategories.Select(sc => new SubCatDTO
                {
                    SubCatId = sc.SubCatId,
                    SubCatName = sc.SubCatName
                }).ToList()
            }).ToList();
        }











       

    }
}
    

