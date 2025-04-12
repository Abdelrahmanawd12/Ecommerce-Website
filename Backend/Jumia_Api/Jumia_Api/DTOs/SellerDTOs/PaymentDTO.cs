namespace Jumia_Api.DTOs.SellerDTOs
{
    public class PaymentDTO
    {
        public int PaymentId { get; set; }
        public string PaymentMethod { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Status { get; set; }
        public string TransactionId { get; set; }
        public int OrderId { get; set; }
    }

}
