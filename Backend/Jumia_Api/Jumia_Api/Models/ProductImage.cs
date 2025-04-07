using Jumia.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia_Api.Models
{
    [Table("ProductImage")]
    public class ProductImage
    {
        public int Id { get; set; }
        public string Url { get; set; }

        [ForeignKey("Product")]
        public int ProductId { get; set; }

        // Navigation property
        public virtual Product Product { get; set; }    
    }
}
