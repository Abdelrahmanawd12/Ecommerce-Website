using Jumia.Models;

namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class SubCategoryDTO
    {
        public int SubCatId { get; set; }
        public string SubCatName { get; set; }
        public string CategoryName { get; set; }

        public List<ProductsDTO> Products { get; set; } = new List<ProductsDTO>();

    }
}
