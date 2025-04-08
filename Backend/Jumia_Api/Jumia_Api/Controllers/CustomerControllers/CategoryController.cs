using AutoMapper;
using Jumia.Data;
using Jumia.Models;
using Jumia_Api.DTOs.CustomerDTOs;
using Jumia_Api.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Jumia_Api.Controllers.CustomerControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
         //JumiaDbContext _context;
         GenericRepository<Category> repo;
        IMapper _mapper;

        public CategoryController(GenericRepository<Category> _repo,IMapper mapper)
        {
            _mapper = mapper;
            repo = _repo;
        }
        [HttpGet]
        public IActionResult GetAllCategories()
        {
            var categories = repo.GetAll();// _context.Categories.ToList();
            var cat= _mapper.Map<List<CategoryDTO>>(categories);
            return Ok(cat);
        }
        [HttpGet("{id}")]
        public IActionResult GetCategoryById(int id)
        {
            var category = repo.GetById(id);//_context.Categories.FirstOrDefault(c => c.CatId == id);
            if (category == null)
            {
                return NotFound();
            }
            var categoryies=_mapper.Map<CategoryDTO>(category);
            return Ok(categoryies);
        }
    }
}
