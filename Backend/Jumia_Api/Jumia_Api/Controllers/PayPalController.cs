using Jumia_Api.Services.PayPalService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using global::Jumia_Api.DTOs.PaymentDTOs;
using global::Jumia_Api.DTOs.SellerDTOs;
using global::Jumia_Api.UnitOFWorks;
using Jumia.Models;

using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;
using PayPalCheckoutSdk.Payments;
using System.Net;


namespace Jumia_Api.Controllers.CheckoutController
    {
    [Route("api/payment")]
    [ApiController]
        public class PayPalPaymentController : ControllerBase
        {
            private readonly UnitOFWork unit;
            private readonly IMapper mapper;
            private readonly PayPalHttpClient _payPalClient;

            public PayPalPaymentController(UnitOFWork unitOfWork, IMapper _mapper, IConfiguration config)
            {
                unit = unitOfWork;
                mapper = _mapper;

                // Initialize PayPal client
                var environment = new SandboxEnvironment(
                    config["PayPal:ClientId"],
                    config["PayPal:Secret"]);
                _payPalClient = new PayPalHttpClient(environment);
            }

            [HttpPost("/paypal-create-order")]
            public async Task<IActionResult> CreatePayPalOrder([FromBody] PaymentRequestDto request)
            {
                try
                {
                    var orderRequest = new OrdersCreateRequest();
                    orderRequest.Prefer("return=representation");
                    orderRequest.RequestBody(new OrderRequest()
                    {
                        CheckoutPaymentIntent = "CAPTURE",
                        PurchaseUnits = new List<PurchaseUnitRequest>()
                    {
                        new PurchaseUnitRequest()
                        {
                            AmountWithBreakdown = new AmountWithBreakdown()
                            {
                                CurrencyCode = "USD",
                                Value = request.Amount.ToString("0.00")
                            },
                            Description = "Order Payment"
                        }
                    },
                        ApplicationContext = new ApplicationContext()
                        {
                            ReturnUrl = request.SuccessUrl,
                            CancelUrl = request.CancelUrl,
                            BrandName = "Your Brand Name",
                            UserAction = "PAY_NOW"
                        }
                    });

                    var response = await _payPalClient.Execute(orderRequest);
                    var result = response.Result<Jumia.Models.Order>();

                    return Ok(new { orderId = result.OrderId });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }
            }

            [HttpPost("/paypal-capture-order")]
            public async Task<IActionResult> CapturePayPalOrder([FromBody] string orderId)
            {
                try
                {
                    var request = new OrdersCaptureRequest(orderId);
                    request.Prefer("return=representation");
                    request.RequestBody(new OrderActionRequest());

                    var response = await _payPalClient.Execute(request);
                    var result = response.Result<PayPal.Sdk.Checkout.Orders.Order>();

                    if (result.Status == PayPal.Sdk.Checkout.Orders.EOrderStatus.Completed)

                    {
                        // Payment was successful
                        return Ok(new { status = "success", orderId = result.Id });
                    }

                    return BadRequest(new { status = "failed", reason = result.Status });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }
            }

            [HttpPost("/checkout-paypal")]
            public async Task<IActionResult> PayPalCheckout(CheckoutRequestDTO checkoutRequest)
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

                    var order = new Jumia.Models.Order
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

            // Keep the same helper methods as your original controller
            [HttpGet("/paypalCartData")]
            public IActionResult GetCartData([FromQuery] int productId)
            {
                var product = unit.ProductsRepository.GetById(productId);
                if (product == null)
                    return NotFound("Product not found");

                var sellerId = product.SellerId;
                return Ok(sellerId);
            }

            [HttpGet("paypal/address")]
            public IActionResult GetAddress(string customerId)
            {
                var addresses = unit.AddressRepository.GetAddressesByCustomerId(customerId);

                if (addresses == null || !addresses.Any())
                    return NotFound("No addresses found for this customer.");

                var addressDtos = mapper.Map<List<AddressDTO>>(addresses);

                return Ok(addressDtos);
            }

            [HttpPost("address")]
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
        }
    }
