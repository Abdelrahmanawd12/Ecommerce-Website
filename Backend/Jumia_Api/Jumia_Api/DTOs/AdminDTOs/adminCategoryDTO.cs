
namespace Jumia_Api.DTOs.AdminDTOs
{
    public class adminCategoryDTO
    {
        
            public int Id { get; set; }
            public string Name { get; set; }

            public List<SubCatDTO> Subcategory { get; set; } = new List<SubCatDTO>();
        }
    }

