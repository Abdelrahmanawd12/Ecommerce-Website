namespace Jumia_Api.DTOs.AdminDTOs
{
    public class UpdateAdminDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }

        public bool IsDeleted { get; set; } = false;
    }

}
