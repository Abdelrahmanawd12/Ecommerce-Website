using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    [Table("WishlistItem")]
    public class WishlistItem
    {
        [Key]
        public int WishlistItemId { get; set; }

        [ForeignKey("Wishlist")]
        public int WishlistId { get; set; }

        [ForeignKey("Product")]
        public int ProductId { get; set; }

        // Navigation property to Wishlist (Many to One)
        public virtual Wishlist Wishlist { get; set; }

        // Navigation property to Product (Many to One)
        public virtual Product Product { get; set; }
    }
}

