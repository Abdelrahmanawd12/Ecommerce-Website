namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class CheckoutCartItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        //public decimal SubTotal { get; set; }
        public string ImageUrl { get; set; }
    }

}
