using Jumia_Api.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    [Table("Product")]
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }

        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        public int Quantity { get; set; }
        public string Brand { get; set; }
        public decimal Discount { get; set; }
        public decimal Weight { get; set; }

        [ForeignKey("Seller")]
        public string SellerId { get; set; }

        // Navigation property for ProductImages (One to Many relationship)
        public virtual ICollection<ProductImage> ProductImages { get; set; }

        // Navigation property for ProductTags (One to Many relationship)
        public virtual ICollection<ProductTag> ProductTags { get; set; }

        // Navigation property for ratings (One to Many relationship)
        public virtual ICollection<Rating> Ratings { get; set; }

        // Navigation property for order items (One to Many relationship)
        public virtual ICollection<OrderItem> OrderItems { get; set; }

        // Navigation property for category (Many to One relationship)
        public virtual Category Category { get; set; }

        // Navigation property for seller (Many to One relationship)
        public virtual Seller Seller { get; set; }

        // Navigation property for cart items (One to Many relationship)
        public virtual ICollection<CartItem> CartItems { get; set; }
    }
}
