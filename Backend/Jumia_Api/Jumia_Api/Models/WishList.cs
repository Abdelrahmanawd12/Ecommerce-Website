using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
    {
    [Table("Wishlist")]
    public class Wishlist
    {
        [Key]
        public int WishlistId { get; set; }

        [ForeignKey("Customer")]
        public string CustomerId { get; set; }

        // Navigation property to Customer (Many to One)
        public virtual Customer Customer { get; set; }

        // Navigation property to Wishlist Items (One to Many)
        public virtual ICollection<WishlistItem> WishlistItems { get; set; }
    }

}

