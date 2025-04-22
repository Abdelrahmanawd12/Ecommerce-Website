using System.ComponentModel.DataAnnotations;

namespace Jumia_Api.DTOs.AdminDTOs
{
    public class CreateUserDTO
    {
        
            [Required]
            public string FirstName { get; set; }

            [Required]
            public string LastName { get; set; }

            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Required]
            [RegularExpression("^(Customer|Seller|Admin)$", ErrorMessage = "Invalid role")]
            public string Role { get; set; }

         
            [Required]
            [DataType(DataType.Date)]
            [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
            public DateTime DateOfBirth { get; set; }

       
            [Required]
            [RegularExpression("^(Male|Female|Other)$", ErrorMessage = "Invalid gender")]
            public string Gender { get; set; }

        
            [Required]
            [DataType(DataType.Password)]
            [StringLength(100, MinimumLength = 8)]
            public string Password { get; set; }

          
            public string StoreName { get; set; }
            public string StoreAddress { get; set; }
        }


    }



