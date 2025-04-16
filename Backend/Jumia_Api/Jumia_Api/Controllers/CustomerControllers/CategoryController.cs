using AutoMapper;
using Jumia.Data;
using Jumia.Models;
using Jumia_Api.DTOs.CustomerDTOs;
using Jumia_Api.Repository;
using Jumia_Api.UnitOFWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Jumia_Api.Controllers.CustomerControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
         UnitOFWork unit;
        IMapper _mapper;

        public CategoryController(UnitOFWork _unit,IMapper mapper)
        {
            _mapper = mapper;
            unit = _unit;
        }
        [HttpGet]
        public IActionResult GetAllCategories()
        {
            var categories = unit.CategoryRepository.GetAll();
            foreach (var category in categories)
            {
                foreach (var sub in category.SubCategories)
                {
                    var catName = sub.Category?.CatName;
                    foreach (var prod in sub.Products)
                    {
                        var subCatName = prod.SubCategory?.SubCatName;
                 
                    }
                }
            }

            var cat = _mapper.Map<List<CategoryDTO>>(categories);
            return Ok(cat);
        }
        [HttpGet("{id}")]
        public IActionResult GetCategoryById(int id)
        {
            var category = unit.CategoryRepository.GetById(id);
            if (category == null)
            {
                return NotFound();
            }
            var categoryies=_mapper.Map<CategoryDTO>(category);
            return Ok(categoryies);
        }
        [HttpGet("{name:alpha}")]
        public IActionResult GetCategoryByName(string name)
        {
            var category = unit.CategoryRepository.GetByName(name); 
            if (category == null)
            {
                return NotFound();
            }
            var categoryies = _mapper.Map<CategoryDTO>(category);
            return Ok(categoryies);
        }

        [HttpGet("{categoryId}/subcategories")]
        public IActionResult GetSubCategoriesByCategoryId(
        int categoryId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 3)
        {
            try
            {
                if (page < 1 || pageSize < 1)
                    return BadRequest("Page and pageSize must be greater than 0.");

                var subcategories = unit.SubCategoryRepository
                                        .GetAll()
                                        .Where(sc => sc.CatId == categoryId);

                var totalCount = subcategories.Count();
                if (totalCount == 0)
                    return NotFound("No subcategories found for this category.");

                var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

                var pagedSubcategories = subcategories
                                        .Skip((page - 1) * pageSize)
                                        .Take(pageSize)
                                        .ToList();

                var subcategoryDtos = _mapper.Map<List<SubCategoryDTO>>(pagedSubcategories);

                var result = new
                {
                    TotalCount = totalCount,
                    TotalPages = totalPages,
                    CurrentPage = page,
                    PageSize = pageSize,
                    Subcategories = subcategoryDtos
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

    }
}
