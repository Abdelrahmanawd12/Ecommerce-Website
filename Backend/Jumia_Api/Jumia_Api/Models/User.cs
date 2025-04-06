using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    [Table("User")]
    public abstract class User
    {
        [Key]
        public int UserId { get; set; }

        [StringLength(20, ErrorMessage = "First name must be at most 20 characters long")]
        public string FirstName { get; set; }

        [StringLength(20, ErrorMessage = "Last name must be at most 20 characters long")]
        public string LastName { get; set; }

        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [DataType(DataType.Password)]
        [StringLength(100, ErrorMessage = "Password must be at least 6 characters long", MinimumLength = 6)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        [Phone(ErrorMessage = "Invalid phone number format")]
        [Required(ErrorMessage = "Phone number is required")]
        [StringLength(11, ErrorMessage = "Phone number must be at most 11 characters long")]
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation property for addresses (One to Many relationship)
        public ICollection<Address> Addresses { get; set; }

        // Navigation property for orders (One to Many relationship)
        public ICollection<Order> Orders { get; set; }

        // Navigation property for ratings (One to Many relationship)
        public ICollection<Rating> Ratings { get; set; }
    }
}
