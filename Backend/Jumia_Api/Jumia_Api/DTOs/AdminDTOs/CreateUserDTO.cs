using System.ComponentModel.DataAnnotations;

namespace Jumia_Api.DTOs.AdminDTOs
{
    public class CreateUserDTO
    {
 
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Role { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public DateTime? DateOfBirth { get; set; }

      
        
    }

}

