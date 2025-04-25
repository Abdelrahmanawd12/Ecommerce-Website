using Jumia_Api.DTOs.SellerDTOs;

namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class OrderConfirmationDto
    {
        public string CustomerId { get; set; }
        public string ShippingAddress { get; set; }

        //// Additional properties needed from Angular interface
        //public DateTime ShippingDate { get; set; } // Root level
        //public string DeliveryStatus { get; set; }

        //public ShippingDto ShippingInfo { get; set; }
        //public PaymentDto Payment { get; set; }
    }


    //public class ShippingDto
    //{
    //    public string ShippingMethod { get; set; }
    //    public string ShippingAddress { get; set; }
    //    public DateTime ShippingDate { get; set; }
    //    public DateTime DeliveryDate { get; set; }
    //    public int TrackingNumber { get; set; }
    //    public string ShippingStatus { get; set; }
    //    public string ReceiverName { get; set; }
    //    public string ReceiverPhone { get; set; }
    //    public string ReceiverEmail { get; set; }
    //}

    //public class PaymentDto
    //{
    //    public string PaymentMethod { get; set; }
    //    public string Status { get; set; }
    //    public string TransactionId { get; set; }
    //    public DateTime TransactionDate { get; set; }
    //    public decimal Amount { get; set; }
    //}
}
