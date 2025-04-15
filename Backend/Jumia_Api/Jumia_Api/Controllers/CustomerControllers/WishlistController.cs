using Jumia.Data;
using Jumia.Models;
using Jumia_Api.DTOs.CustomerDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jumia_Api.Controllers.CustomerControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly JumiaDbContext _context;

        public WishlistController(JumiaDbContext context)
        {
            _context = context;
        }


        // GET: api/Wishlist/{customerId}
        [HttpGet("{customerId}")]
        public async Task<ActionResult<IEnumerable<WishlistItemDto>>> GetWishlist(string customerId)
        {
            var wishlistItems = await _context.Wishlist
                .Include(w => w.WishlistItems)
                    .ThenInclude(wi => wi.Product)
                        .ThenInclude(p => p.ProductImages)
                .Where(w => w.CustomerId == customerId)
                .SelectMany(w => w.WishlistItems.Select(wi => new WishlistItemDto
                {
                    WishlistItemId = wi.WishlistItemId,
                    ProductId = wi.Product.ProductId,
                    ProductName = wi.Product.Name,
                    Price = wi.Product.Price,
                    Discount = wi.Product.Discount,
                    Brand = wi.Product.Brand,
                    ImageUrl = wi.Product.ProductImages.FirstOrDefault().Url
                }))
                .ToListAsync();

            return Ok(wishlistItems);
        }


        [HttpDelete("item/{wishlistItemId}")]
        public async Task<IActionResult> DeleteWishlistItem(int wishlistItemId)
        {
            var item = await _context.WishlistItems.FindAsync(wishlistItemId);

            if (item == null)
                return NotFound("Wishlist item not found.");

            _context.WishlistItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpPost("add-to-cart")]
        public async Task<IActionResult> AddToCart([FromBody] int wishlistItemId)
        {
            var wishlistItem = await _context.WishlistItems
                .Include(wi => wi.Wishlist)
                .FirstOrDefaultAsync(wi => wi.WishlistItemId == wishlistItemId);

            if (wishlistItem == null)
                return NotFound("Wishlist item not found.");

            var customerId = wishlistItem.Wishlist.CustomerId;

            // Get the customer's cart
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (cart == null)
            {
                cart = new Cart { CustomerId = customerId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync(); // Save to generate CartId
            }

            // Check if item already in cart
            var existingItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == wishlistItem.ProductId);
            if (existingItem != null)
            {
                existingItem.Quantity += 1;
            }
            else
            {
                var newItem = new CartItem
                {
                    CartId = cart.CartId,
                    ProductId = wishlistItem.ProductId,
                    Quantity = 1
                };
                _context.CartItems.Add(newItem);
            }

            // Optional: remove item from wishlist
            _context.WishlistItems.Remove(wishlistItem);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Item added to cart." });

        }

    }
}
