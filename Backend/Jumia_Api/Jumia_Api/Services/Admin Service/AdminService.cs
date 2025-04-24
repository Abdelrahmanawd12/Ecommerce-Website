using Jumia.Data;
using Jumia.Models;
using Jumia_Api.DTOs.AdminDTOs;
using Jumia_Api.DTOs.CustomerDTOs;
using Jumia_Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Jumia_Api.Services.Admin_Service
{
    public class AdminService : IAdminService
    {
        private readonly JumiaDbContext _context;
        private readonly UserManager<ApplicationUser> userManager;
        RoleManager<IdentityRole> roleManager;
        public AdminService(JumiaDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            this.userManager = userManager;
            this.roleManager = roleManager;
        }
        private AdminDTO MapToAdminDTO(ApplicationUser user, string role)
        {
            var adminDto = new AdminDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = role,
                Gender = user.Gender,
                DateOfBirth = user.DateOfBirth,
                CreatedAt = user.CreatedAt,
                IsDeleted = user.IsDeleted
            };

            if (user is Seller seller)
            {
                adminDto.StoreName = seller.StoreName;
                adminDto.StoreAddress = seller.StoreAddress;
            }

            return adminDto;
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
            var users = await userManager.Users
                .Where(u => !u.IsDeleted)
                .ToListAsync();

            var result = new List<AdminDTO>();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault();

                result.Add(MapToAdminDTO(user, role));
            }

            return result;
        }




        public async Task<AdminDTO> GetUserByIdAsync(string userId)
        {

            var user = await userManager.Users
                .OfType<ApplicationUser>()
                .Where(u => u.Id == userId && !u.IsDeleted)
                .Select(u => new
                {
                    User = u,
                    IsSeller = u is Seller
                })
                .FirstOrDefaultAsync();

            if (user == null) return null;

            var roles = await userManager.GetRolesAsync(user.User);

            var adminDto = new AdminDTO
            {
                Id = user.User.Id,
                FirstName = user.User.FirstName,
                LastName = user.User.LastName,
                Email = user.User.Email,
                Role = roles.FirstOrDefault(),
                Gender = user.User.Gender,
                DateOfBirth = user.User.DateOfBirth,
                CreatedAt = user.User.CreatedAt,
                IsDeleted = user.User.IsDeleted
            };


            if (user.IsSeller)
            {
                var seller = (Seller)user.User;
                adminDto.StoreName = seller.StoreName;
                adminDto.StoreAddress = seller.StoreAddress;
            }

            return adminDto;
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user == null || user.IsDeleted)
                return false;


            user.IsDeleted = true;

            var result = await userManager.UpdateAsync(user);

            return result.Succeeded;
        }

        public async Task<AdminDTO> AddUserAsync(CreateUserDTO userDto)
        {

            var existingUser = await userManager.FindByEmailAsync(userDto.Email);

            if (existingUser != null && !existingUser.IsDeleted)
            {
                throw new Exception("Email is already exist");
            }


            if (existingUser != null && existingUser.IsDeleted)
            {

                existingUser.IsDeleted = false;
                existingUser.UserName = userDto.Email;
                existingUser.Email = userDto.Email;
                existingUser.FirstName = userDto.FirstName;
                existingUser.LastName = userDto.LastName;


                var resetToken = await userManager.GeneratePasswordResetTokenAsync(existingUser);
                var resetResult = await userManager.ResetPasswordAsync(existingUser, resetToken, userDto.Password);

                if (!resetResult.Succeeded)
                {
                    throw new Exception("Failed to update Password: " +
                        string.Join(", ", resetResult.Errors.Select(e => e.Description)));
                }

                if (existingUser is Seller seller)
                {
                    seller.StoreName = userDto.StoreName;
                    seller.StoreAddress = userDto.StoreAddress;
                }

                await userManager.UpdateAsync(existingUser);


                var currentRoles = await userManager.GetRolesAsync(existingUser);
                if (!currentRoles.Contains(userDto.Role))
                {
                    await userManager.RemoveFromRolesAsync(existingUser, currentRoles);
                    await userManager.AddToRoleAsync(existingUser, userDto.Role);
                }

                return new AdminDTO
                {
                    Id = existingUser.Id,
                    FirstName = existingUser.FirstName,
                    LastName = existingUser.LastName,
                    Email = existingUser.Email,
                    Role = userDto.Role,
                    Gender = existingUser.Gender,
                    DateOfBirth = existingUser.DateOfBirth,
                    CreatedAt = existingUser.CreatedAt
                };
            }

            ApplicationUser newUser = userDto.Role switch
            {
                "Seller" => new Seller
                {
                    StoreName = userDto.StoreName,
                    StoreAddress = userDto.StoreAddress,
                    Gender = userDto.Gender,
                    DateOfBirth = userDto.DateOfBirth
                },
                "Admin" => new Admin
                {
                    Gender = userDto.Gender,
                    DateOfBirth = userDto.DateOfBirth
                },
                _ => new Customer
                {
                    Gender = userDto.Gender,
                    DateOfBirth = userDto.DateOfBirth
                }
            };

            newUser.UserName = userDto.Email;
            newUser.Email = userDto.Email;
            newUser.FirstName = userDto.FirstName;
            newUser.LastName = userDto.LastName;

            var createResult = await userManager.CreateAsync(newUser, userDto.Password);

            if (!createResult.Succeeded)
            {
                throw new Exception("Failed in Add user " +
                    string.Join(", ", createResult.Errors.Select(e => e.Description)));
            }

            await userManager.AddToRoleAsync(newUser, userDto.Role);

            return new AdminDTO
            {
                Id = newUser.Id,
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                Email = newUser.Email,
                Role = userDto.Role,
                Gender = newUser.Gender,
                DateOfBirth = newUser.DateOfBirth,
                CreatedAt = DateTime.UtcNow
            };
        }

        public async Task<AdminDTO> UpdateUserAsync(AdminDTO userDto)
        {
            try
            {

                var user = await userManager.FindByIdAsync(userDto.Id);
                if (user == null || user.IsDeleted)
                    return null;

                user.FirstName = userDto.FirstName;
                user.LastName = userDto.LastName;
                user.Email = userDto.Email;
                user.UserName = userDto.Email;
                user.Gender = userDto.Gender;
                user.DateOfBirth = userDto.DateOfBirth;


                if (user is Seller seller)
                {
                    seller.StoreName = userDto.StoreName ?? seller.StoreName;
                    seller.StoreAddress = userDto.StoreAddress ?? seller.StoreAddress;
                }


                var updateResult = await userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                    return null;


                var currentRoles = await userManager.GetRolesAsync(user);
                if (!currentRoles.Contains(userDto.Role))
                {
                    await userManager.RemoveFromRolesAsync(user, currentRoles);
                    await userManager.AddToRoleAsync(user, userDto.Role);
                }


                var roles = await userManager.GetRolesAsync(user);
                return MapToAdminDTO(user, roles.FirstOrDefault());
            }
            catch
            {
                return null;
            }
        }

        public async Task<AdminDashboardDTO> GetDashboardStatsAsync()
        {
            var totalCategories = await _context.Categories.CountAsync();
            var totalSubCategories = await _context.SubCategories.CountAsync();

            var totalUsers = await _context.Users.CountAsync(u => !u.IsDeleted);

            var newUsersThisMonth = await _context.Users
                .CountAsync(u => !u.IsDeleted &&
                                 u.CreatedAt.Month == DateTime.Now.Month &&
                                 u.CreatedAt.Year == DateTime.Now.Year);

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
            if (categoryDto == null)
            {
                throw new ArgumentNullException(nameof(categoryDto));
            }

            bool categoryExists = await _context.Categories
                .AnyAsync(c => c.CatName.ToLower() == categoryDto.Name.Trim().ToLower());

            if (categoryExists)
            {
                throw new InvalidOperationException($"Category '{categoryDto.Name}' already exists.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var category = new Category
                {
                    CatName = categoryDto.Name.Trim(),
                    SubCategories = new List<SubCategory>()
                };

                await _context.Categories.AddAsync(category);
                await _context.SaveChangesAsync();

                if (categoryDto.Subcategory != null && categoryDto.Subcategory.Any())
                {
                    foreach (var subCatDto in categoryDto.Subcategory)
                    {
                        if (string.IsNullOrWhiteSpace(subCatDto.SubCatName))
                        {
                            throw new ArgumentException("SubCategory name cannot be empty.");
                        }

                        category.SubCategories.Add(new SubCategory
                        {
                            SubCatName = subCatDto.SubCatName.Trim(),
                            CatId = category.CatId
                        });
                    }

                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                categoryDto.Id = category.CatId;
                categoryDto.Subcategory = category.SubCategories
                    .Select(sc => new SubCatDTO
                    {
                        SubCatId = sc.SubCatId,
                        SubCatName = sc.SubCatName,
                        CategoryName = category.CatName
                    }).ToList();

                return categoryDto;
            }
            catch
            {
                await transaction.RollbackAsync();

                throw;
            }
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


        public async Task<bool> AddSubcategoryAsync(SubCatDTO subCatDto)
        {
            if (subCatDto == null || string.IsNullOrWhiteSpace(subCatDto.SubCatName) || string.IsNullOrWhiteSpace(subCatDto.CategoryName))
                return false;

            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.CatName.ToLower() == subCatDto.CategoryName.ToLower());

            if (category == null)
                return false;


            bool subCategoryExists = await _context.SubCategories
                .AnyAsync(sc => sc.SubCatName.ToLower() == subCatDto.SubCatName.ToLower()
                             && sc.CatId == category.CatId);

            if (subCategoryExists)
                return false;

            var subCategory = new SubCategory
            {
                SubCatName = subCatDto.SubCatName,
                CatId = category.CatId
            };

            _context.SubCategories.Add(subCategory);
            var result = await _context.SaveChangesAsync();

            return result > 0;
        }




    }
}