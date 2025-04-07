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
        public virtual Product Product { get; set; }
    }
}
