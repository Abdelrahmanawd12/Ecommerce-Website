using System.ComponentModel.DataAnnotations;

namespace Jumia_Api.DTOs.SellerDTOs;

    public class AddressDTO
    {
        public int AddressId { get; set; }
        [Required(ErrorMessage = "Street is required")]
        public string Street { get; set; }

        [Required(ErrorMessage = "City is required")]
        public string City { get; set; }

        [Required(ErrorMessage = "Country is required")]
        public string Country { get; set; }

        [Required(ErrorMessage = "UserId is required")]
        public string UserId { get; set; }



    }

