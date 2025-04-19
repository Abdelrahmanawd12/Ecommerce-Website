using System.Security.Claims;
using Jumia.Data;
using Jumia.Models;
using Jumia_Api.DTOs.CustomerDTOs;
using Jumia_Api.DTOs.SellerDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jumia_Api.Controllers.CustomerControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckoutController : ControllerBase
    {
        private readonly JumiaDbContext _context;

        public CheckoutController(JumiaDbContext context)
        {
            _context = context;
        }


        // GET: api/account/address-book/{customerId}
        [HttpGet("address-book/{customerId}")]
        public async Task<ActionResult<AddressBookDto>> GetAddressBook(string customerId)
        {
            // Get user by ID
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == customerId);
            if (user == null)
                return NotFound("User not found.");

            // Manually fetch the address using the UserId FK
            var address = await _context.Addresses.FirstOrDefaultAsync(a => a.UserId == customerId);
            if (address == null)
                return NotFound("No address found.");

            var dto = new AddressBookDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Street = address.Street,
                City = address.City,
                Country = address.Country
            };

            return Ok(dto);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddAddress([FromBody] CreateAddressDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // تأكد إن اليوزر موجود
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var address = new Address
            {
                Street = dto.Street,
                City = dto.City,
                Country = dto.Country,
                UserId = dto.UserId
            };

            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Address added successfully", addressId = address.AddressId });
        }





        [HttpGet("cart-products/{customerId}")]
        public async Task<IActionResult> GetCartProducts(string customerId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                        .ThenInclude(p => p.ProductImages)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (cart == null || cart.CartItems == null || !cart.CartItems.Any())
            {
                return NotFound("No products found in the cart.");
            }

            var products = cart.CartItems.Select(ci => new CartProductDto
            {
                ProductId = ci.Product.ProductId,
                Name = ci.Product.Name,
                ImageUrl = ci.Product.ProductImages.FirstOrDefault()?.Url,
                Quantity = ci.Quantity,
                Price = ci.Product.Price,
                Discount = ci.Product.Discount,
                TotalPrice = (ci.Product.Price - ci.Product.Discount) * ci.Quantity
            }).ToList();

            var totalCartPrice = products.Sum(p => p.TotalPrice);

            return Ok(new
            {
                //Products = products,
                //TotalCartPrice = totalCartPrice
                products = products,              // ✅ small p
                grandTotal = totalCartPrice       // ✅ same name
            });
        }



        //[HttpPost("confirm")]
        //public async Task<IActionResult> ConfirmOrder([FromBody] OrderConfirmationDto dto)
        //{
        //    var cart = await _context.Carts
        //        .Include(c => c.CartItems)
        //        .ThenInclude(ci => ci.Product)
        //        .FirstOrDefaultAsync(c => c.CustomerId == dto.CustomerId);

        //    if (cart == null || !cart.CartItems.Any())
        //        return BadRequest("Cart is empty or not found.");

        //    var newOrder = new Order
        //    {
        //        CustomerId = dto.CustomerId,
        //        SellerId = "user2", // تعيين قيمة ثابتة كـ string
        //        OrderDate = DateTime.Now,
        //        OrderStatus = "Pending",
        //        PaymentMethod = "Cash on Delivery",
        //        PaymentStatus = "Unpaid",
        //        ShippingAddress = dto.ShippingAddress,
        //        TotalAmount = cart.CartItems.Sum(i => i.Product.Price * i.Quantity),
        //        OrderTrackingNumber = new Random().Next(100000, 999999),
        //        OrderItems = new List<OrderItem>()
        //    };

        //    foreach (var item in cart.CartItems)
        //    {
        //        if (item.Product.Quantity < item.Quantity)
        //            return BadRequest($"Not enough stock for product: {item.Product.Name}");

        //        item.Product.Quantity -= item.Quantity;

        //        newOrder.OrderItems.Add(new OrderItem
        //        {
        //            ProductId = item.ProductId,
        //            Quantity = item.Quantity,
        //            SubTotal = item.Quantity * item.Product.Price
        //        });
        //    }

        //    _context.Orders.Add(newOrder);

        //    var payment = new Payment
        //    {
        //        PaymentMethod = "Cash on Delivery",
        //        Amount = newOrder.TotalAmount,
        //        PaymentDate = DateTime.Now,
        //        Status = "Pending",
        //        TransactionId = Guid.NewGuid().ToString(),
        //        Order = newOrder
        //    };

        //    _context.Payments.Add(payment);

        //    _context.CartItems.RemoveRange(cart.CartItems);

        //    await _context.SaveChangesAsync();

        //    return Ok(new
        //    {
        //        message = "Order confirmed and payment record created.",
        //        orderTrackingNumber = newOrder.OrderTrackingNumber,
        //        orderId = newOrder.OrderId
        //    });
        //}
        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmOrder([FromBody] OrderConfirmationDto dto)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.CustomerId == dto.CustomerId);

            if (cart == null || !cart.CartItems.Any())
                return BadRequest("Cart is empty or not found.");

            // Group cart items by SellerId
            var itemsBySeller = cart.CartItems
                .GroupBy(ci => ci.Product.SellerId)
                .ToList();

            var createdOrders = new List<Order>();

            foreach (var sellerGroup in itemsBySeller)
            {
                var sellerId = sellerGroup.Key;

                var newOrder = new Order
                {
                    CustomerId = dto.CustomerId,
                    SellerId = sellerId,
                    OrderDate = DateTime.Now,
                    OrderStatus = "Pending",
                    PaymentMethod = "Cash on Delivery",
                    PaymentStatus = "Unpaid",
                    ShippingAddress = dto.ShippingAddress,
                    TotalAmount = sellerGroup.Sum(i => i.Product.Price * i.Quantity),
                    OrderTrackingNumber = new Random().Next(100000, 999999),
                    OrderItems = new List<OrderItem>()
                };

                foreach (var item in sellerGroup)
                {
                    if (item.Product.Quantity < item.Quantity)
                        return BadRequest($"Not enough stock for product: {item.Product.Name}");

                    item.Product.Quantity -= item.Quantity;

                    newOrder.OrderItems.Add(new OrderItem
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        SubTotal = item.Quantity * item.Product.Price
                    });

                    _context.CartItems.Remove(item); // Remove item from cart after it's added to the order
                }

                _context.Orders.Add(newOrder);

                var payment = new Payment
                {
                    PaymentMethod = "Cash on Delivery",
                    Amount = newOrder.TotalAmount,
                    PaymentDate = DateTime.Now,
                    Status = "Pending",
                    TransactionId = Guid.NewGuid().ToString(),
                    Order = newOrder
                };

                _context.Payments.Add(payment);

                createdOrders.Add(newOrder);
            }

            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = "Orders confirmed and payments created.",
                orders = createdOrders.Select(o => new
                {
                    o.OrderTrackingNumber,
                    o.OrderId,
                    o.SellerId,
                    o.OrderDate,
                    o.OrderStatus,
                    o.PaymentMethod,
                    o.PaymentStatus,
                    o.ShippingAddress,
                    shippingInfo = o.ShippingInfo != null ? new
                    {
                        o.ShippingInfo.ShippingMethod,
                        o.ShippingInfo.ShippingAddress,
                        o.ShippingInfo.ShippingDate,
                        o.ShippingInfo.DeliveryDate,
                        o.ShippingInfo.TrackingNumber,
                        o.ShippingInfo.ShippingStatus,
                        o.ShippingInfo.ReceiverName,
                        o.ShippingInfo.ReceiverPhone,
                        o.ShippingInfo.ReceiverEmail
                    } : null, // Ensure ShippingInfo is not null
                    orderItems = o.OrderItems.Select(oi => new
                    {
                        oi.ProductId,
                        oi.Quantity,
                        oi.SubTotal,
                        oi.Product.Name,
                        oi.Product.Brand,
                        oi.Product.ProductImages,
                    }),
                    payment = new
                    {
                        o.Payment?.PaymentMethod,
                        o.Payment?.Status,
                        o.Payment?.TransactionId,
                        o.Payment?.PaymentDate,
                        o.Payment?.Amount
                    }
                })
            });
        }


    //    return Ok(new
    //        {
    //            message = "Orders confirmed and payments created.",
    //            orders = createdOrders.Select(o => new
    //            {
    //                orderTrackingNumber = o.OrderTrackingNumber,
    //                orderId = o.OrderId,
    //                sellerId = o.SellerId
    //})
    //        });







        //// GET: api/account/address-book/{customerId}
        //[HttpGet("address-book/{customerId}")]
        //public async Task<ActionResult<AddressBookDto>> GetAddressBook(string customerId)
        //{
        //    // Get user by ID
        //    var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == customerId);
        //    if (user == null)
        //        return NotFound("User not found.");

        //    // Manually fetch the address using the UserId FK
        //    var address = await _context.Addresses.FirstOrDefaultAsync(a => a.UserId == customerId);
        //    if (address == null)
        //        return NotFound("No address found.");

        //    var dto = new AddressBookDto
        //    {
        //        FirstName = user.FirstName,
        //        LastName = user.LastName,
        //        PhoneNumber = user.PhoneNumber,
        //        Street = address.Street,
        //        City = address.City,
        //        Country = address.Country
        //    };

        //    return Ok(dto);
        //}


        //[HttpPut("address-book/{customerId}")]
        //public async Task<IActionResult> UpdateAddressBook(string customerId, AddressBookDto dto)
        //{
        //    var customer = await _context.Users.FirstOrDefaultAsync(c => c.Id == customerId);
        //    if (customer == null)
        //        return NotFound("User not found.");

        //    // Update user info
        //    customer.FirstName = dto.FirstName;
        //    customer.LastName = dto.LastName;
        //    customer.PhoneNumber = dto.PhoneNumber;

        //    // Manually fetch the address using UserId
        //    var address = await _context.Addresses.FirstOrDefaultAsync(a => a.UserId == customerId);
        //    if (address != null)
        //    {
        //        address.Street = dto.Street;
        //        address.City = dto.City;
        //        address.Country = dto.Country;
        //    }
        //    else
        //    {
        //        return NotFound("No address found to update.");
        //    }

        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}








        ////[HttpGet("summary/{customerId}")]
        ////public IActionResult GetCartSummary(string customerId)
        ////{
        ////    var cart = _context.Carts
        ////        .Include(c => c.CartItems)
        ////            .ThenInclude(ci => ci.Product)
        ////        .Include(c => c.Customer)
        ////        .FirstOrDefault(c => c.CustomerId == customerId);

        ////    if (cart == null)
        ////    {
        ////        return NotFound("Cart not found");
        ////    }

        ////    if (cart.Customer == null)
        ////    {
        ////        return NotFound("Customer not found");
        ////    }

        ////    int totalItems = cart.CartItems.Sum(i => i.Quantity);

        ////    decimal totalPrice = cart.CartItems.Sum(i =>
        ////        (i.Product.Price - i.Product.Discount) * i.Quantity);

        ////    decimal totalDiscount = cart.CartItems.Sum(i =>
        ////        i.Product.Discount * i.Quantity);

        ////    var cartSummary = new
        ////    {
        ////        CustomerName = cart.Customer.FirstName + " " + cart.Customer.LastName,
        ////        TotalItems = totalItems,
        ////        TotalPrice = totalPrice,
        ////        TotalDiscount = totalDiscount
        ////    };

        ////    return Ok(cartSummary);
        ////}
        //[HttpGet("summary/{customerId}")]
        //public IActionResult GetCartSummary(string customerId)
        //{
        //    var cart = _context.Carts
        //        .Include(c => c.CartItems)
        //            .ThenInclude(ci => ci.Product)
        //        .Include(c => c.Customer)
        //        .FirstOrDefault(c => c.CustomerId == customerId);

        //    if (cart == null)
        //        return NotFound("Cart not found");

        //    if (cart.Customer == null)
        //        return NotFound("Customer not found");

        //    int totalItems = cart.CartItems.Sum(i => i.Quantity);
        //    decimal totalPrice = cart.CartItems.Sum(i => (i.Product.Price - i.Product.Discount) * i.Quantity);
        //    decimal totalDiscount = cart.CartItems.Sum(i => i.Product.Discount * i.Quantity);

        //    var cartSummary = new CartSummaryDto
        //    {
        //        CustomerName = cart.Customer.FirstName + " " + cart.Customer.LastName,
        //        TotalItems = totalItems,
        //        TotalPrice = totalPrice,
        //        TotalDiscount = totalDiscount
        //    };

        //    return Ok(cartSummary);
        //}





    }
}
