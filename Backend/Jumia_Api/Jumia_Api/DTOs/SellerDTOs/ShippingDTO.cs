namespace Jumia_Api.DTOs.SellerDTOs
{
    public class ShippingDTO
    {
        public int ShippingId { get; set; }
        public int OrderId { get; set; }
        public string ShippingMethod { get; set; }
        public string ShippingAddress { get; set; }
        public string ShippingDate { get; set; }
        public string DeliveryDate { get; set; }
        public string TrackingNumber { get; set; }
        public string ShippingStatus { get; set; }
        public string ReceiverName { get; set; }
        public string ReceiverPhone { get; set; }
        public string ReceiverEmail { get; set; }
    }

}
