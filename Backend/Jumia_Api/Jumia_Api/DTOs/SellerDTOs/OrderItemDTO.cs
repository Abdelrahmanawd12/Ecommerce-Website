using Jumia.Models;
using Jumia_Api.DTOs.CustomerDTOs;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia_Api.DTOs.SellerDTOs
{
    public class OrderItemDTO
    {
        public int OrderItemId { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public string productName { get; set; }
        public string Brand { get; set; }
        public int Quantity { get; set; }
        public decimal SubTotal { get; set; }
        public ProductsDTO Product { get; set; } 



        public List<ProductImgDTO> ProductImages { get; set; }
    }

}
