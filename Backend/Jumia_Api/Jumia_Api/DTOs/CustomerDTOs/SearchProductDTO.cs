using Jumia_Api.Models;

namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class SearchProductDTO
    {
        public int ProductId { get; set; }  
        public string Name { get; set; }      
        public string Brand { get; set; }    
        public ICollection<ProductTag> Tags { get; set; } 
        public decimal Discount { get; set; }
    }
}
