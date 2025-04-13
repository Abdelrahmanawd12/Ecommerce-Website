namespace Jumia_Api.DTOs.SellerDTOs
{
    public class OrderDTO
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; }
        public string ShippingAddress { get; set; }
        public decimal TotalAmount { get; set; }
        public int OrderTrackingNumber { get; set; }
        public string CustomerId { get; set; }

        // Lists
        public List<OrderItemDTO> OrderItems { get; set; }

        // Optional related objects
        public ShippingDTO ShippingInfo { get; set; }
        public PaymentDTO Payment { get; set; }

    }

}
