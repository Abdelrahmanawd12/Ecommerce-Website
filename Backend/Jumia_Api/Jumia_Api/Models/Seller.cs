using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    public class Seller : ApplicationUser
        {
        public string StoreName { get; set; }
        public string ShippingZone { get; set; }
        public string StoreAddress { get; set; }
        
        // Navigation property for products (One to Many relationship)
        public virtual ICollection<Product> Products { get; set; }
    }
}
