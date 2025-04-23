namespace Jumia_Api.DTOs.SellerDTOs
{
    public class UpdateOrderStatusRequestDTO
    {
        public string SellerId { get; set; }
        public int OrderId { get; set; }
        public string Status { get; set; }
    }
}
