using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    [Table("Rating")]
    public class Rating
    {
        [Key]
        public int RatingId { get; set; }

        [ForeignKey("Product")]
        public int ProductId { get; set; }
        public virtual Product Product { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public virtual User User { get; set; }

        [ForeignKey("Order")]
        public int OrderId { get; set; }
        public virtual Order Order { get; set; }
        public decimal Stars { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
