using Jumia.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class AwadWishListItemDTO
    {
        public int WishlistItemId { get; set; }
        public int WishlistId { get; set; }
        public List<ProductsDTO> Products { get; set; } = new List<ProductsDTO>();


    }
}
