using Jumia.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia_Api.Models
{
    public class ProductTag
    {
        public int Id { get; set; }
        public string Tag { get; set; }

        [ForeignKey("Product")]
        public int ProductId { get; set; }

        // Navigation property
        public Product Product { get; set; }
    }
}
