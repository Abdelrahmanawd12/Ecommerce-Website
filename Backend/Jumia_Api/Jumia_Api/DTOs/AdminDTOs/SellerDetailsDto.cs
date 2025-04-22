namespace Jumia_Api.DTOs.AdminDTOs
{
    public class SellerDetailsDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Gender { get; set; }
        public DateTime DOB { get; set; }
        public string StoreName { get; set; }
        public string StoreAddress { get; set; }
        public string ShippingZone { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
