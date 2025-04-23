namespace Jumia_Api.DTOs.PaymentDTOs
{
    public class PaymentRequestDto
    {
        public decimal Amount { get; set; }
        public string SuccessUrl { get; set; }
        public string CancelUrl { get; set; }
    }
}
