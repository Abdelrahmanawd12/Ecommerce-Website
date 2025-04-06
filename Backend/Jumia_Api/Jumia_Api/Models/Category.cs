using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    [Table("Category")]
    public class Category
    {
        [Key]
        public int CatId { get; set; }

        [MinLength(3),MaxLength(50)]
        public string CatName { get; set; }

        // Navigation property for SubCategories (One to Many relationship)
        public virtual ICollection<SubCategory> SubCategories { get; set; }

        // Navigation property for Products (One to Many relationship)
        public virtual ICollection<Product> Products { get; set; }
    }
}
