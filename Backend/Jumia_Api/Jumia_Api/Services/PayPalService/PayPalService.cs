using Microsoft.AspNetCore.Http;
using System.Net.Http;
     using PayPalCheckoutSdk.Core;
    using PayPalCheckoutSdk.Orders;
    using PayPalCheckoutSdk.Payments;
    using System.Collections.Generic;
using PayPalHttp;

namespace Jumia_Api.Services.PayPalService
    {
        public class PayPalService
        {
            private readonly PayPalHttpClient _payPalClient;
            private readonly IConfiguration _configuration;

            public PayPalService(IConfiguration configuration)
            {
                _configuration = configuration;

                var environment = new SandboxEnvironment(
                    _configuration["PayPal:ClientId"],
                    _configuration["PayPal:SecretKey"]
                );
                _payPalClient = new PayPalHttpClient(environment);
            }

            public async Task<string> CreateCheckoutSessionAsync(decimal amount, string successUrl, string cancelUrl)
            {
                var request = new OrdersCreateRequest();
                request.Prefer("return=representation");
                request.RequestBody(new OrderRequest
                {
                    CheckoutPaymentIntent = "CAPTURE",
                    PurchaseUnits = new List<PurchaseUnitRequest>
                {
                    new PurchaseUnitRequest
                    {
                        AmountWithBreakdown = new AmountWithBreakdown
                        {
                            CurrencyCode = "USD",
                            Value = amount.ToString("0.00")
                        },
                        Description = "Jumia Clone Purchase"
                    }
                },
                    ApplicationContext = new ApplicationContext
                    {
                        ReturnUrl = successUrl,
                        CancelUrl = cancelUrl,
                        BrandName = "Jumia Clone"
                    }
                });

                var response = await _payPalClient.Execute(request);
                var result = response.Result<Order>();

                return result.Links.First(l => l.Rel == "approve").Href;
            }
        }
    }

