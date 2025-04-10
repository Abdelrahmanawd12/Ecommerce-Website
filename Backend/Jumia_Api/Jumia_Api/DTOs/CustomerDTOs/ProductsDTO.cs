using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class ProductsDTO
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string SubCategoryName { get; set; }
        public int Quantity { get; set; }
        public string Brand { get; set; }
        public List<decimal> RatingStars { get; set; } // List of Ratings
        public List<string> ImageUrls { get; set; }  // List of Image URLs
        public List<string> Tags { get; set; }       // List of Tags
        public decimal Discount { get; set; }
        public decimal Weight { get; set; }
    }

}
