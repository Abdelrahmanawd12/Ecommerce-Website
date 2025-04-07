using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    public class ApplicationUser : IdentityUser
    {
        [StringLength(20, ErrorMessage = "First name must be at most 20 characters long")]
        public string FirstName { get; set; }

        [StringLength(20, ErrorMessage = "Last name must be at most 20 characters long")]
        public string LastName { get; set; }

        public string Role { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; }

        public virtual ICollection<Order>? Orders { get; set; }
        public virtual ICollection<Rating>? Ratings { get; set; }
        public virtual ICollection<Address>? Addresses { get; set; }

    }
}
