namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class WishlistItemDto
    {
        public int WishlistItemId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public string Brand { get; set; }
        public string ImageUrl { get; set; }
    }

}
