using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    [Table("Cart")]  // Table name in the database
    public class Cart
    {
        [Key]
        public int CartId { get; set; }

        // Foreign key for Customer (One-to-One relationship)
        [ForeignKey("Customer")]
        public string CustomerId { get; set; }

        // Navigation property
        public virtual Customer Customer { get; set; }
        // Navigation property for cart items (One to Many relationship)
        public virtual ICollection<CartItem> CartItems { get; set; }
    }
}
