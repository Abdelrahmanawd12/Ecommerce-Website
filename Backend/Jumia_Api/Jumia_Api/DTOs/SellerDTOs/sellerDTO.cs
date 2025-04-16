using Jumia.Models;

namespace Jumia_Api.DTOs.SellerDTOs
{
    public class sellerDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime DOB { get; set; }
        public DateTime CreatedAt { get; set; }
        public string StoreName { get; set; }
        public string ShippingZone { get; set; }
        public string StoreAddress { get; set; }
    }
}
