namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class AddToCartDTO
    {
        public string CustomerId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
