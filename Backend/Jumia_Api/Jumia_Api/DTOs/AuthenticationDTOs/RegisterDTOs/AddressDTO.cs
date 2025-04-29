using System.ComponentModel.DataAnnotations;

namespace Jumia_Api.DTOs.AuthenticationDTOs.RegisterDTOs
{
    public class AddressDTO
    {
        [Required]
        public string Street { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Country { get; set; }
    }
}
