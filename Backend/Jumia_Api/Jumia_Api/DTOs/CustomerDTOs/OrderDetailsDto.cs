namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class OrderDetailsDto
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; }
        public string ShippingAddress { get; set; }
        public decimal TotalAmount { get; set; }
        public int OrderTrackingNumber { get; set; }

        public ShippingStatusDto ShippingInfo { get; set; } // From Shipping table
        public string CustomerName { get; set; } // From ApplicationUser

        ////public string CustomerName { get; set; }
        //public string CustomerId { get; set; }  // Updated to string, as per your model

        //public List<OrderItemDto> Items { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }  // Add this
        public string ProductName { get; set; }
        public string ProductImageUrl { get; set; }  // Optional: For showing image
        public int Quantity { get; set; }
        public decimal SubTotal { get; set; }
    }



    public class OrderSummaryDto
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderItemSummaryDto> Items { get; set; }
    }

    public class OrderItemSummaryDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductImageUrl { get; set; }
    }


    // New DTO
    public class ShippingStatusDto
    {
        public string TrackingNumber { get; set; }
        public string ShippingStatus { get; set; }
        public DateTime? EstimatedDelivery { get; set; }
    }

}
