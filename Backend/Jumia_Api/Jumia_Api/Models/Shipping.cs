using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    [Table("Shipping")]
    public class Shipping
    {
        [Key]
        public int ShippingId { get; set; }

        [ForeignKey("Order")]
        public int OrderId { get; set; }
        public string ShippingMethod { get; set; }
        public string ShippingAddress { get; set; }
        public string ShippingDate { get; set; }
        public string DeliveryDate { get; set; }
        public string TrackingNumber { get; set; }
        public string ShippingStatus { get; set; }
        public string ReceiverName {get; set; }
        public string ReceiverPhone { get; set; }
        public string ReceiverEmail { get; set; }

        // Navigation property for order (One to One relationship)
        public virtual Order Order { get; set; }
    }
}
