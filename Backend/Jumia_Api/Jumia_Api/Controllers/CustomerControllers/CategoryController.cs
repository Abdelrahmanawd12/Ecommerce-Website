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
            var cat= _mapper.Map<List<CategoryDTO>>(categories);
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
    }
}
