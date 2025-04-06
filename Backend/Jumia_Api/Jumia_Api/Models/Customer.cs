using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    public class Customer : User
    {
        
        // Navigation property for cart (One to One relationship)
        public virtual Cart Cart { get; set; }

        // Navigation property for orders (One to Many relationship)
        public virtual ICollection<Order> Orders { get; set; }
    }
}
