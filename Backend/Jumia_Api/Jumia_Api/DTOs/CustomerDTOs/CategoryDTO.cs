namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<string> ProductsName { get; set; } = new List<string>();
    }
}
