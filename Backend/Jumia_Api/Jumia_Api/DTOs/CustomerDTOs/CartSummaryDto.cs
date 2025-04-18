namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class CartSummaryDto
    {
        public string CustomerName { get; set; }
        public int TotalItems { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal TotalDiscount { get; set; }
    }
}
