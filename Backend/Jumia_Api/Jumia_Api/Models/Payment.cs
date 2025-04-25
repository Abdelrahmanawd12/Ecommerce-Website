using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    [Table("Payment")]
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }
        public string PaymentMethod { get; set; } 
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Status { get; set; } 
        public string TransactionId { get; set; }

        [ForeignKey("Order")]
        public int OrderId { get; set; } // Foreign key to Order

        // Navigation property for order (One to One relationship)
        public virtual Order Order { get; set; }
    }
}
