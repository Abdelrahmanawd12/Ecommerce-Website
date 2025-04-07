using System.ComponentModel.DataAnnotations;

namespace Jumia_Api.DTOs.AuthenticationDTOs
{
    public class LoginDTO
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
