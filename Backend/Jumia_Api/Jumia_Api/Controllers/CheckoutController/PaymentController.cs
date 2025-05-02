using AutoMapper;
using Jumia.Models;
using Jumia_Api.DTOs.PaymentDTOs;
using Jumia_Api.DTOs.SellerDTOs;
using Jumia_Api.Services.StripeService;
using Jumia_Api.UnitOFWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe.Checkout;

namespace Jumia_Api.Controllers.CheckoutController
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly StripeService _stripeService;

        private readonly UnitOFWork unit;
        private readonly IMapper mapper;

        public PaymentController(UnitOFWork unitOfWork, IMapper _mapper, StripeService stripeService)
        {
            unit = unitOfWork;
            mapper = _mapper;
            _stripeService = stripeService;

        }


        [HttpPost("/checkout-session")]
        public async Task<IActionResult> CreateCheckoutSession([FromBody] PaymentRequestDto request)
        {
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
        {
            new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    Currency = "egp",
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = "Order total",
                    },
                    UnitAmount = (long?)(request.Amount * 100),
                },
                Quantity = 1,
            },
        },
                Mode = "payment",
                SuccessUrl = request.SuccessUrl,
                CancelUrl = request.CancelUrl,
            };

            var service = new SessionService();
            Session session = await service.CreateAsync(options);

            return Ok(new { sessionId = session.Id });
        }



        [HttpPost("/checkout")]
        public async Task<IActionResult> Checkout(CheckoutRequestDTO checkoutRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var groupedItems = checkoutRequest.CartItems
                .GroupBy(item => item.SellerId)
                .ToList();

            List<OrderDTO> createdOrdersDTO = new();

            foreach (var group in groupedItems)
            {
                var sellerId = group.First().SellerId;

                var productIds = group.Select(x => x.ProductId).ToList();
                var products = unit.ProductsRepository
                    .GetAll()
                    .Where(p => productIds.Contains(p.ProductId))
                    .ToList();

                var order = new Order
                {
                    OrderDate = DateTime.Now,
                    OrderStatus = "Pending",
                    PaymentMethod = checkoutRequest.PaymentMethod,
                    PaymentStatus = "Pending",
                    ShippingAddress = checkoutRequest.Shipping.ShippingAddress,
                    CustomerId = checkoutRequest.CustomerId,
                    SellerId = sellerId,
                    OrderItems = group.Select(item =>
                    {
                        var product = products.FirstOrDefault(p => p.ProductId == item.ProductId);
                        return new OrderItem
                        {
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            SubTotal = item.Quantity * item.UnitPrice,
                            Product = product
                        };
                    }).ToList(),
                    TotalAmount = group.Sum(i => i.Quantity * i.UnitPrice),
                };

                unit.OrderRepository.Add(order);
                unit.Save();

                var shipping = new Shipping
                {
                    OrderId = order.OrderId,
                    ShippingMethod = checkoutRequest.Shipping.ShippingMethod,
                    ShippingAddress = checkoutRequest.Shipping.ShippingAddress,
                    ReceiverName = checkoutRequest.Shipping.ReceiverName,
                    ReceiverPhone = checkoutRequest.Shipping.ReceiverPhone,
                    ReceiverEmail = checkoutRequest.Shipping.ReceiverEmail,
                    TrackingNumber = $"TRK-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
                    ShippingStatus = "Preparing",
                    ShippingDate = DateTime.Now.ToString("yyyy-MM-dd"),
                    DeliveryDate = DateTime.Now.AddDays(5).ToString("yyyy-MM-dd")
                };
                unit.ShippingRepository.Add(shipping);

                var payment = new Payment
                {
                    OrderId = order.OrderId,
                    PaymentMethod = checkoutRequest.PaymentMethod,
                    Status = checkoutRequest.Payment.Status,
                    Amount = checkoutRequest.Payment.Amount,
                    PaymentDate = DateTime.Now,
                    TransactionId = Guid.NewGuid().ToString().Substring(0, 8).ToUpper()
                };
                unit.PaymentRepository.Add(payment);

                unit.Save();

                var orderDTO = new OrderDTO
                {
                    OrderId = order.OrderId,
                    OrderDate = order.OrderDate,
                    OrderStatus = order.OrderStatus,
                    PaymentMethod = order.PaymentMethod,
                    PaymentStatus = order.PaymentStatus,
                    ShippingAddress = order.ShippingAddress,
                    TotalAmount = order.TotalAmount,
                    CustomerId = order.CustomerId,
                    SellerId = order.SellerId,
                    OrderItems = order.OrderItems.Select(item => new OrderItemDTO
                    {
                        OrderId = order.OrderId,
                        OrderItemId = item.OrderItemId,
                        ProductId = item.ProductId,
                        productName = item.Product?.Name,
                        Brand = item.Product?.Brand,
                        Quantity = item.Quantity,
                        SubTotal = item.SubTotal
                    }).ToList(),
                    ShippingInfo = new ShippingDTO
                    {
                        OrderId = order.OrderId,
                        ShippingId = shipping.ShippingId,
                        ShippingMethod = shipping.ShippingMethod,
                        ShippingAddress = shipping.ShippingAddress,
                        ReceiverName = shipping.ReceiverName,
                        ReceiverPhone = shipping.ReceiverPhone,
                        ReceiverEmail = shipping.ReceiverEmail,
                        TrackingNumber = shipping.TrackingNumber,
                        ShippingStatus = shipping.ShippingStatus,
                        ShippingDate = shipping.ShippingDate,
                        DeliveryDate = shipping.DeliveryDate
                    },
                    Payment = new PaymentDTO
                    {
                        OrderId = order.OrderId,
                        PaymentId = payment.PaymentId,
                        PaymentMethod = payment.PaymentMethod,
                        Amount = payment.Amount,
                        PaymentDate = payment.PaymentDate,
                        Status = payment.Status,
                        TransactionId = payment.TransactionId
                    }
                };

                createdOrdersDTO.Add(orderDTO);
            }

            return Ok(createdOrdersDTO);
        }



        //-------------------------------------------------------------
        [HttpGet("/cartData")]
        public IActionResult GetCartData([FromQuery] int productId)
        {
            var product = unit.ProductsRepository.GetById(productId);
            if (product == null)
                return NotFound("Product not found");

            var sellerId = product.SellerId;
            return Ok(sellerId);
        }

        //--------------------------------------------------------------------
        [HttpGet("/address")]
        public IActionResult GetAddress(string customerId)
        {
            var addresses = unit.AddressRepository.GetAddressesByCustomerId(customerId);

            if (addresses == null || !addresses.Any())
                return NotFound("No addresses found for this customer.");

            var addressDtos = mapper.Map<List<AddressDTO>>(addresses);

            return Ok(addressDtos);
        }
        //----------------------------------------------------------
        [HttpPost("/address")]
        public IActionResult AddAddress(AddressDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var address = mapper.Map<Address>(dto);

            unit.AddressRepository.Add(address);
            unit.Save();

            return Ok(new
            {
                message = "Address added successfully.",
                address = dto
            });
        }
        //------------------------------------------------------
        [HttpPatch("/updateStock")]
        public IActionResult UpdateStock([FromBody] List<OrderItemsDto> orderItems)
        {
            foreach (var item in orderItems)
            {
                var product = unit.ProductsRepository.GetById(item.ProductId);
                if (product != null)
                {
                    if (item.Quantity > 0)
                    {
                        if (product.Quantity >= item.Quantity)
                        {
                            product.Quantity -= item.Quantity;
                        }
                        else
                        {
                            return BadRequest(new { message = $"Product with {item.ProductId} 5 not found." });
                        }
                    }
                    else
                    {
                        return BadRequest(new { message = $"Product with {item.ProductId} 5 not found." });
                    }
                }
                else
                {
                    return NotFound(new { message = $"Product with ID {item.ProductId} not found." });
                }
            }

            unit.Save();
            return Ok(new { message = "Stock updated successfully." });
        }

    }
}