using Jumia.Models;
using System.ComponentModel.DataAnnotations;

namespace Jumia_Api.DTOs.AuthenticationDTOs.RegisterDTOs
{
    public class SellerRegisterDTO
    {

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string PhoneNumber { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; }

        public string StoreName { get; set; }
        public string ShippingZone { get; set; }
        public string StoreAddress { get; set; }


    }
}
