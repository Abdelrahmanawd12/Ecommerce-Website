using Jumia.Data;
using Jumia_Api.DTOs.CustomerDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Jumia_Api.Controllers.CustomerControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
         JumiaDbContext _context;

        public CategoryController(JumiaDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult GetAllCategories()
        {
            var categories = _context.Categories.ToList();
            List<CategoryDTO> categoriesDTO = new List<CategoryDTO>();
            foreach (var item in categories)
            {
                var categoryDTO = new CategoryDTO
                {
                    Id = item.CatId,
                    Name = item.CatName,
                    ProductsName = item.Products.Select(p => p.Name).ToList()

                };
                categoriesDTO.Add(categoryDTO);
            }
            return Ok(categoriesDTO);
        }
        [HttpGet("{id}")]
        public IActionResult GetCategoryById(int id)
        {
            var category = _context.Categories.FirstOrDefault(c => c.CatId == id);
            if (category == null)
            {
                return NotFound();
            }
            var categoryDTO = new CategoryDTO
            {
                Id = category.CatId,
                Name = category.CatName,
                ProductsName = category.Products.Select(p => p.Name).ToList()
            };
            return Ok(categoryDTO);
        }
    }
}
