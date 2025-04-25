namespace Jumia_Api.DTOs.CustomerDTOs
{
        public class CreateAddressDto
        {
            public string Street { get; set; }
            public string City { get; set; }
            public string Country { get; set; }
            public string UserId { get; set; } // هنحتاجه علشان نربط العنوان بالمستخدم
        }

}
