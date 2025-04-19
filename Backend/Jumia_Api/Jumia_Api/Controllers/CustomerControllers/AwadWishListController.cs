using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Jumia.Models;
using Jumia_Api.DTOs.CustomerDTOs;
using Jumia_Api.UnitOFWorks;

namespace Jumia_Api.Controllers.CustomerControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AwadWishListController : ControllerBase
    {
        UnitOFWork unit;
        IMapper mapper;
        public AwadWishListController(UnitOFWork _unit, IMapper _mapper)
        {
            unit = _unit;
            mapper = _mapper;
        }
        [HttpGet("{customerId}")]
        public IActionResult GetWishList(string customerId)
        {
            var wishList = unit.WishlistRepository.GetAll().FirstOrDefault(c => c.CustomerId == customerId);
            if (wishList == null)
            {
                return NotFound("WishList not found");
            }
            var wishListDTO = mapper.Map<AwadWishListDTO>(wishList);
            return Ok(wishListDTO);
        }
        [HttpPost("AddItem")]
        public IActionResult AddToWishList(AddToWishListDTO dto)
        {
            // Check if product exists
            var product = unit.ProductsRepository.GetById(dto.ProductId);
            if (product == null)
                return NotFound("Product not found");

            // Get existing wishlist for customer
            var wishlist = unit.WishlistRepository.GetAll().FirstOrDefault(w => w.CustomerId == dto.CustomerId);

            // If wishlist doesn't exist, create a new one
            if (wishlist == null)
            {
                wishlist = new Wishlist
                {
                    CustomerId = dto.CustomerId,
                    WishlistItems = new List<WishlistItem>()
                };

                unit.WishlistRepository.Add(wishlist);
                unit.Save();
            }

            // Check if item already in wishlist
            var exists = wishlist.WishlistItems?.Any(w => w.ProductId == dto.ProductId) ?? false;
            if (exists)
                return BadRequest(new { message = "Product already exists in wishlist" });
            // Add new WishlistItem
            var wishlistItem = new WishlistItem
            {
                WishlistId = wishlist.WishlistId,
                ProductId = dto.ProductId
            };

            unit.WishlistItemRepository.Add(wishlistItem);
            unit.Save();

            return Ok(new { message = "Product added to wishlist" });
        }
        [HttpDelete("RemoveItem")]
        public IActionResult RemoveFromWishList(int productId, string customerId)
        {
            // Get existing wishlist for customer
            var wishlist = unit.WishlistRepository.GetAll().FirstOrDefault(w => w.CustomerId == customerId);
            if (wishlist == null)
                return NotFound("Wishlist not found");
            // Find the item to remove
            var itemToRemove = wishlist.WishlistItems?.FirstOrDefault(i => i.ProductId == productId);
            if (itemToRemove == null)
                return NotFound("Item not found in wishlist");
            unit.WishlistItemRepository.Delete(itemToRemove.WishlistItemId);
            unit.Save();
            return Ok(new { message = "Product removed from wishlist" });
        }
        [HttpDelete("Clear")]
        public IActionResult ClearWishList(string customerId)
        {
            // Get existing wishlist for customer
            var wishlist = unit.WishlistRepository.GetAll().FirstOrDefault(w => w.CustomerId == customerId);
            if (wishlist == null)
                return NotFound("Wishlist not found");

            // Get all WishlistItems for this wishlist
            var wishlistItems = unit.WishlistItemRepository.GetAll().Where(wi => wi.WishlistId == wishlist.WishlistId).ToList();

            if (wishlistItems.Count == 0)
                return Ok(new { message = "Wishlist is already empty" });

            foreach (var item in wishlistItems)
            {
                unit.WishlistItemRepository.Delete(item.WishlistItemId);
            }

            unit.Save();
            return Ok(new { message = "Wishlist cleared" });
        }

    }
}
