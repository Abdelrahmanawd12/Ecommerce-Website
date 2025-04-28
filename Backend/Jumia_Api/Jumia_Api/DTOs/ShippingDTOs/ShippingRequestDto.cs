namespace Jumia_Api.DTOs.ShippingDTOs
{
    public class ShippingRequestDto
    {
        public string OrderId { get; set; }
        public string CustomerName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }

        public List<ShippingItemDto> Items { get; set; }
    }
}
