using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    [Table("SubCategory")]
    public class SubCategory
    {
        // Primary key for the SubCategory
        [Key]
        public int SubCatId { get; set; }
        public string SubCatName { get; set; }
        // Foreign key for the Category (Many to One relationship)
        [ForeignKey("Category")]
        public int CatId { get; set; }

        // Navigation property for the Category (Many to One relationship)
        public virtual Category Category { get; set; }

    }
}
