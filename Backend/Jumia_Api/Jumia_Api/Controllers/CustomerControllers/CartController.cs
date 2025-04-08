using AutoMapper;
using Jumia.Models;
using Jumia_Api.DTOs.CustomerDTOs;
using Jumia_Api.UnitOFWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Jumia_Api.Controllers.CustomerControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        UnitOFWork unit;
        IMapper mapper;
        public CartController(UnitOFWork unit, IMapper mapper)
        {
            this.unit = unit;
            this.mapper = mapper;
        }
        [HttpGet("{customerId}")]
        public IActionResult GetCart(string customerId)
        {
            var cart = unit.CartRepository.GetAll().FirstOrDefault(c => c.CustomerId == customerId);
            if (cart == null)
            {
                return NotFound("Cart not found");
            }
            var cartDTO = mapper.Map<CartDTO>(cart);
            return Ok(cartDTO);
        }
        [HttpPost("AddItem")]
        public IActionResult AddItemToCart(AddToCartDTO dto)
        {
            if (dto.Quantity <= 0)
                return BadRequest("Quantity must be at least 1");

            var cart = unit.CartRepository.GetAll()
                .FirstOrDefault(c => c.CustomerId == dto.CustomerId);

            if (cart == null)
            {
                cart = new Cart
                {
                    CustomerId = dto.CustomerId,
                    CartItems = new List<CartItem>()
                };
                unit.CartRepository.Add(cart);
            }

            var existingItem = cart.CartItems.FirstOrDefault(i => i.ProductId == dto.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += dto.Quantity;
            }
            else
            {
                cart.CartItems.Add(new CartItem
                {
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity
                });
            }

            unit.Save();
            return Ok("Item added successfully");
        }

        [HttpPut("update/{customerId}/{productId}")]
        public IActionResult UpdateCartItemQuantity(string customerId, int productId, [FromBody] int quantityChange)
        {
            if (quantityChange == 0)
                return BadRequest("Quantity change must not be zero");

            var cart = unit.CartRepository.GetAll()
                .FirstOrDefault(c => c.CustomerId == customerId);

            if (cart == null)
            {
                return NotFound("Cart not found");
            }

            var cartItem = cart.CartItems.FirstOrDefault(i => i.ProductId == productId);

            if (cartItem == null)
            {
                return NotFound("Item not found in cart");
            }

            cartItem.Quantity += quantityChange;

            if (cartItem.Quantity < 1)
            {
                cartItem.Quantity = 1;  
            }

            unit.Save();
            return Ok("Item quantity updated successfully");
        }
        [HttpDelete("remove/{customerId}/{productId}")]
        public IActionResult RemoveItemFromCart(string customerId, int productId)
        {
            var cart = unit.CartRepository.GetAll()
                .FirstOrDefault(c => c.CustomerId == customerId);

            if (cart == null)
            {
                return NotFound("Cart not found");
            }

            var cartItem = cart.CartItems.FirstOrDefault(i => i.ProductId == productId);

            if (cartItem == null)
            {
                return NotFound("Item not found in cart");
            }

            cart.CartItems.Remove(cartItem);

            unit.Save();

            return Ok("Item removed from cart successfully");
        }
        [HttpGet("summary/{customerId}")]
        public IActionResult GetCartSummary(string customerId)
        {
            var cart = unit.CartRepository.GetAll()
                .FirstOrDefault(c => c.CustomerId == customerId);

            if (cart == null)
            {
                return NotFound("Cart not found");
            }

            int totalItems = cart.CartItems.Sum(i => i.Quantity);

            decimal totalPrice = cart.CartItems.Sum(i => (i.Product.Price - i.Product.Discount) * i.Quantity);

            decimal totalDiscount = cart.CartItems.Sum(i => (i.Product.Discount) * i.Quantity);

            var cartSummary = new
            {
                CustomerName = cart.Customer.FirstName + " " + cart.Customer.LastName,
                TotalItems = totalItems,
                TotalPrice = totalPrice,
                TotalDiscount = totalDiscount 
            };

            return Ok(cartSummary);
        }

        [HttpDelete("clear/{customerId}")]
        public IActionResult ClearCart(string customerId)
        {
            var cart = unit.CartRepository.GetAll().FirstOrDefault(c => c.CustomerId == customerId);

            if (cart == null)
            {
                return NotFound("Cart not found");
            }

            cart.CartItems.Clear();

            unit.Save();

            return Ok("Cart cleared successfully");
        }


    }
}
