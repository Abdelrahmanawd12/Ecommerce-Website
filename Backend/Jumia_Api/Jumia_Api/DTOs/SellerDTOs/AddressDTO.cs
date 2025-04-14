namespace Jumia_Api.DTOs.SellerDTOs
{
    public class AddressDTO
    {
        public int AddressId { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string UserId { get; set; }  // (For many-to-one relationship with User)


    }
}
