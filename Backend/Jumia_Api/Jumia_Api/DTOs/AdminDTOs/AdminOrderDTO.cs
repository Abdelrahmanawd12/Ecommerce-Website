namespace Jumia_Api.DTOs.AdminDTOs
{
    public class AdminOrderDTO
    {
        public int OrderId { get; set; }
        public string UserId { get; set; }
        public string CustomerName { get; set; }  // إضافة اسم العميل
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public List<AdminOrderItemDTO> OrderItems { get; set; }
        public List<string> Products {  get; set; }
        
    }
}
