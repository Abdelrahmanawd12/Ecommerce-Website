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

        public string SubCategoryName { get; set; }

        [Required]
        public string SellerId { get; set; }


        [Required]
        public List<IFormFile> ImageUrls { get; set; }

        [Required]
        public List<string> Tags { get; set; }

        public string Status = "Pending";


    }
}
