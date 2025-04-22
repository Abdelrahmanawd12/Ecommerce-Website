namespace Jumia_Api.DTOs.AdminDTOs
{
    public class AdminDTO
    {
            public string Id { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Role { get; set; }
            public string Email { get; set; }
            public DateTime DateOfBirth { get; set; }
            public DateTime CreatedAt { get; set; }
            public string Gender { get; set; }
        public bool IsDeleted { get; set; } = false;
        
        public string? StoreName { get; set; }
        public string? StoreAddress { get; set; }

      

    }

    }

