using AutoMapper;
using Jumia.Models;
using Jumia_Api.DTOs.CustomerDTOs;
namespace Jumia_Api.MapperConfig
{
    public class AutoMapperConfig : Profile
    {
        public AutoMapperConfig()
        {
            CreateMap<Product, ProductsDTO>().AfterMap((src, dest) =>
            {
                dest.CategoryName = src.Category.CatName.ToString();
                dest.ImageUrls = src.ProductImages.Select(img => img.Url).ToList();
                dest.RatingStars = src.Ratings.Select(s => s.Stars).ToList();
                dest.Tags = src.ProductTags.Select(t => t.Tag).ToList();

            });
            CreateMap<Category, CategoryDTO>().AfterMap((src, des)=>
            {
                des.Name = src.CatName.ToString();
                des.Id = src.CatId;
                des.ProductsName = src.Products.Select(p => p.Name).ToList();
                des.Subcategory = src.SubCategories.Select(s => s.SubCatName).ToList();
            }
            );
            CreateMap<Cart,CartDTO>().AfterMap((src, dest) =>
            {
                dest.CartId = src.CartId;
                dest.CustomerName = src.Customer.FirstName+" "+src.Customer.LastName;
                dest.Items = src.CartItems.Select(c => new CartItemDTO
                {
                    ProductName = c.Product.Name,
                    Quantity = c.Quantity
                }).ToList();
            });
        }
    }
}