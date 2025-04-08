using Jumia.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class CartDTO
    {
        public int CartId { get; set; }
        public string CustomerName { get; set; }
        public List<CartItemDTO> Items { get; set; } = new List<CartItemDTO>();


    }
}
