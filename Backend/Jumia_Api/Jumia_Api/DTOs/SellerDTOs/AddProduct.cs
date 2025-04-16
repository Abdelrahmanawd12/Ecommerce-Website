using System.ComponentModel.DataAnnotations;

namespace Jumia_Api.DTOs.SellerDTOs
{
    public class AddProduct
    {

        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public string Brand { get; set; }
        [Required]
        public decimal Discount { get; set; }
        [Required]
        public decimal Weight { get; set; }
        [Required]
        public int SubCategoryId { get; set; }
        [Required]
        public string SubCategoryName { get; set; }

        public string Status  = "pending";
        [Required]
        public string SellerId { get; set; }
        public List<IFormFile> ImageUrls { get; set; }  // List of Image URLs
        [Required]
        public List<string> Tags { get; set; }
    }
}
