using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jumia.Models
{
    [Table("Address")]  // Table name in the database
    public class Address
    {
        [Key]
        public int AddressId { get; set; }  // Primary Key

        public string Street { get; set; }

        public string City { get; set; }

        public string Country { get; set; }

        //[ForeignKey("User")]  // Foreign key attribute for the User
        public string UserId { get; set; }  // Foreign key for the User (Many to One relationship)

        // Navigation property for user (Many to One relationship)
        //public virtual Customer User { get; set; }  // Address belongs to a User
    }
}
