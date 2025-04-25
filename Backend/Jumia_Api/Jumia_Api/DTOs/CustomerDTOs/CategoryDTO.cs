namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<SubCategoryDTO> Subcategory { get; set; } = new List<SubCategoryDTO>();
    }
}
