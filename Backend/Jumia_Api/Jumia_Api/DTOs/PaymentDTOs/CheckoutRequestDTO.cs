using Jumia_Api.DTOs.CustomerDTOs;
using Jumia_Api.DTOs.SellerDTOs;

namespace Jumia_Api.DTOs.PaymentDTOs
{
    public class CheckoutRequestDTO
    {
            public string CustomerId { get; set; }
            public string SellerId { get; set; }
            public string PaymentMethod { get; set; }
            public string ShippingAddress { get; set; }
        public List<OrderItemDto> Items { get; set; }

        public List<CartItemDTO> CartItems { get; set; }
            public ShippingDTO Shipping { get; set; }
            public PaymentDTO Payment { get; set; }


    }
}
