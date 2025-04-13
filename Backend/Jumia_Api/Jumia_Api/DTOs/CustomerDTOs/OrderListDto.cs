namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class OrderListDto
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; }

        public List<OrderItemSummaryDto> Items { get; set; }
    }

    

}
