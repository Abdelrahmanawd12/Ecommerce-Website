using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    [Table("OrderItem")]
    public class OrderItem
    {
        [Key]
        public int OrderItemId { get; set; }

        // Foreign key for Order (Many to One relationship)
        [ForeignKey("Order")]
        public int OrderId { get; set; }

        // Foreign key for Product (Many to One relationship)
        [ForeignKey("Product")]
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal SubTotal { get; set; }
        // Navigation properties
        public virtual Order Order { get; set; }  // Many to One relationship with Order
        public virtual Product Product { get; set; }  // Many to One relationship with Product
    }
}
