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
        [Required]
        public string SellerId { get; set; }
        [Required]
        public List<decimal> RatingStars { get; set; } // List of Ratings
        [Required]
        public List<IFormFile> ImageUrls { get; set; }  // List of Image URLs
        [Required]
        public List<string> Tags { get; set; }
    }
}
