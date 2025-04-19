using AutoMapper;
using Jumia.Models;
using Jumia_Api.DTOs.CustomerDTOs;
using Jumia_Api.DTOs.SellerDTOs;
using Jumia_Api.Models;
namespace Jumia_Api.MapperConfig
{
    public class AutoMapperConfig : Profile
    {
        public AutoMapperConfig()
        {
            CreateMap<Product, ProductsDTO>().AfterMap((src, dest) =>
            {
                dest.SubCategoryName = src.SubCategory.SubCatName.ToString();
                dest.ImageUrls = src.ProductImages.Select(img => img.Url).ToList();
                dest.RatingStars = src.Ratings.Select(s => s.Stars).ToList();
                dest.Tags = src.ProductTags.Select(t => t.Tag).ToList();

            });
            CreateMap<Category, CategoryDTO>().AfterMap((src, des) =>
            {
                des.Name = src.CatName.ToString();
                des.Id = src.CatId;
                des.Subcategory = src.SubCategories.Select(s => new SubCategoryDTO
                {
                    SubCatId = s.SubCatId,
                    SubCatName = s.SubCatName,
                    CategoryName = src.CatName.ToString(),

                    Products = s.Products.Select(p => new ProductsDTO
                    {
                        ProductId = p.ProductId,
                        Name = p.Name,
                        Description = p.Description,
                        SubCategoryName = s.SubCatName.ToString(),
                        Price = p.Price,
                        Quantity = p.Quantity,
                        Brand = p.Brand,
                        Discount = p.Discount,
                        Weight = p.Weight,
                        ImageUrls = p.ProductImages.Select(img => img.Url).ToList(),
                        RatingStars = p.Ratings.Select(r => r.Stars).ToList(),
                        Tags = p.ProductTags.Select(t => t.Tag).ToList()
                    }).ToList()
                }).ToList();
            }
            );
            CreateMap<Cart, CartDTO>().AfterMap((src, dest) =>
            {
                dest.CartId = src.CartId;

                if (src.Customer != null)
                {
                    dest.CustomerName = src.Customer.FirstName + " " + src.Customer.LastName;
                }
                else
                {
                    dest.CustomerName = "Unknown";  // 
                }

                dest.Items = src.CartItems.Select(c => new CartItemDTO
                {
                    ProductName = c.Product.Name,
                    ProductId = c.ProductId,
                    ProductStock = c.Product.Quantity,
                    Discount = c.Product.Discount,
                    Quantity = c.Quantity,
                    Price = c.Product.Price,
                    ImageUrl = c.Product.ProductImages
                      .OrderBy(img => img.Id)
                      .FirstOrDefault()?.Url

                }).ToList();
            });

            CreateMap<SubCategory, SubCategoryDTO>().AfterMap((src, dest) =>
            {
                dest.SubCatName = src.SubCatName;
                dest.SubCatId = src.SubCatId;
                dest.CategoryName = src.Category?.CatName ?? "Unknown";
                dest.Products = src.Products.Select(p => new ProductsDTO
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Description = p.Description,
                    SubCategoryName = src.SubCatName.ToString(),
                    Price = p.Price,
                    Quantity = p.Quantity,
                    Brand = p.Brand,
                    Discount = p.Discount,
                    Weight = p.Weight,
                    ImageUrls = p.ProductImages.Select(img => img.Url).ToList(),
                    RatingStars = p.Ratings.Select(r => r.Stars).ToList(),
                    Tags = p.ProductTags.Select(t => t.Tag).ToList()
                }).ToList();


            });
            CreateMap<CartItem, CartItemDTO>().AfterMap((src, dest) =>
            {
                dest.ProductId = src.ProductId;
                dest.ProductName = src.Product.Name;
                dest.Quantity = src.Quantity;
                dest.Discount = src.Product.Discount;
                dest.Price = src.Product.Price;
                dest.ProductStock = src.Product.Quantity;
                dest.ImageUrl = src.Product.ProductImages.FirstOrDefault()?.Url;
            });


            CreateMap<Product, ProductsSellerDTO>().AfterMap((src, dest) =>
            {
                dest.SubCategoryName = src.SubCategory.SubCatName.ToString();
                dest.ImageUrls = src.ProductImages.Select(img => img.Url).ToList();
                dest.RatingStars = src.Ratings.Select(s => s.Stars).ToList();
                dest.Tags = src.ProductTags.Select(t => t.Tag).ToList();
            });

            // Shipping
            CreateMap<Shipping, ShippingDTO>();

            // Payment
            CreateMap<Payment, PaymentDTO>();

            // Product Image
            CreateMap<ProductImage, ProductImgDTO>()
                .ForMember(dest => dest.ImgUrl, opt => opt.MapFrom(src => src.Url));

            // Order Item
            CreateMap<OrderItem, OrderItemDTO>()
                .ForMember(dest => dest.productName, opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(dest => dest.Brand, opt => opt.MapFrom(src => src.Product.Brand))
                .ForMember(dest => dest.SubTotal, opt => opt.MapFrom(src => src.Quantity * src.Product.Price));
            // Order
            CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.ShippingInfo, opt => opt.MapFrom(src => src.ShippingInfo))
                .ForMember(dest => dest.Payment, opt => opt.MapFrom(src => src.Payment))
                .ForMember(dest => dest.OrderTrackingNumber, opt => opt.MapFrom(src => src.OrderTrackingNumber));

            // Mapping from ApplicationUser to UserDTO
            CreateMap<ApplicationUser, UserDTO>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender));

            // Mapping from Address to AddressDTO
            CreateMap<Address, AddressDTO>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId));

            //Mapping from Seller To SellerDTO
            CreateMap<Seller, sellerDTO>()
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.DOB, opt => opt.MapFrom(src => src.DateOfBirth));
            CreateMap<sellerDTO, Seller>()
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Phone))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DOB))
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            //----------------------------------- 
            CreateMap<Product, SearchProductDTO>()
               .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
               .ForMember(dest => dest.Brand, opt => opt.MapFrom(src => src.Brand))
               .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.ProductTags.Select(t => t.Tag).ToList()));
        }
    }
}