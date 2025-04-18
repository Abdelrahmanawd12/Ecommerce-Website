namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class CartProductDto
    {
        public int ProductId { get; set; }         // Product ID
        public string Name { get; set; }           // Product Name
        public string ImageUrl { get; set; }       // Product Image
        public int Quantity { get; set; }          // CartItem.Quantity
        public decimal Price { get; set; }         // Product.Price
        public decimal Discount { get; set; }      // Product.Discount
        public decimal TotalPrice { get; set; }    // (Price - Discount) * Quantity
    }

}
