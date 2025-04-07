using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    [Table("Order")]
    public class Order
    {
        [Key]
        public int OrderId { get; set; }

        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; }
        public string ShippingAddress { get; set; }
        public decimal TotalAmount { get; set; }
        public int OrderTrackingNumber { get; set; }

        // Foreign keys
        [ForeignKey("User")]
        public string CustomerId { get; set; }

        // Navigation property for order items (One to Many relationship)
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        // Navigation property for shipping info (One to One relationship)
        public virtual Shipping ShippingInfo { get; set; }

        // Navigation property for ratings (One to Many relationship)
        public virtual ICollection<Rating> Ratings { get; set; }

        // Navigation property for customer (Many to One relationship)
        public virtual Customer Customer { get; set; }

        // Navigation property for payment (One to One relationship)
        public virtual Payment Payment { get; set; }
    }
}
