namespace Jumia_Api.DTOs.SellerDTOs
{
    public class UpdateProductInfoDTO
    {
     
            public string Name { get; set; }
            public string Description { get; set; }
            public decimal Price { get; set; }
            public int Quantity { get; set; }
            public string Brand { get; set; }
            public double Discount { get; set; }
            public double Weight { get; set; }
            public int SubCategoryId { get; set; }
            public string SellerId { get; set; }
            public List<string> Tags { get; set; }

    }
}
