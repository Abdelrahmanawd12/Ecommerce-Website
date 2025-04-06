using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    [Table("CartItem")]  // Table name in the database
    public class CartItem
    {
        // Primary key
        [Key]
        public int CartItemId { get; set; }

        // Foreign key for Cart (Many to One relationship)
        [ForeignKey("Cart")]
        public int CartId { get; set; }

        // Foreign key for Product (Many to One relationship)
        [ForeignKey("Product")]
        public int ProductId { get; set; }

        // Quantity of the product in the cart
        public int Quantity { get; set; }
        // Navigation properties
        public virtual Cart Cart { get; set; }  // Many to One relationship with Cart
        public virtual Product Product { get; set; }  // Many to One relationship with Product
    }
}
