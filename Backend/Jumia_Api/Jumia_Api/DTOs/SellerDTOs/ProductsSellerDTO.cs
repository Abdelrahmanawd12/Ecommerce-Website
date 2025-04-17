using Jumia.Models;
using Jumia_Api.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia_Api.DTOs.SellerDTOs
{
    public class ProductsSellerDTO
    {
        [Required]
        public int ProductId { get; set; }
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
        public List<string> ImageUrls { get; set; }  // List of Image URLs
        [Required]
        public List<string> Tags { get; set; }

        public string Status { get; set; } 


    }
}
