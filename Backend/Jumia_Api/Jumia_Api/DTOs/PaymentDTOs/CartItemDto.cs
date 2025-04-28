namespace Jumia_Api.DTOs.PaymentDTOs
{
    public class CartItemDTO
    {
        public int ProductId { get; set; }
        public string SellerId { get; set; } 
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
