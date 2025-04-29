namespace Jumia_Api.DTOs.AuthenticationDTOs.RegisterDTOs
{
    public class OtpEntryDTO
    {
        public string Email { get; set; }
        public string Code { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsUsed { get; set; } = false;
    }
}
