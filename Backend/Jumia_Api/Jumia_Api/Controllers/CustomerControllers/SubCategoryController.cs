using AutoMapper;
using Jumia.Models;
using Jumia_Api.DTOs.CustomerDTOs;
using Jumia_Api.UnitOFWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Jumia_Api.Controllers.CustomerControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubCategoryController : ControllerBase
    {
        UnitOFWork unit;
        IMapper mapper;
        public SubCategoryController(UnitOFWork _unit,IMapper _mapper)
        {
            unit = _unit;
            mapper = _mapper;

        }
        [HttpGet]
        public IActionResult GetAllSubCategories()
        {
            var subCategories = unit.SubCategoryRepository.GetAll();

            var subCat = mapper.Map<List<SubCategoryDTO>>(subCategories);
            return Ok(subCat);
        }
        [HttpGet("{id}")]
        public IActionResult GetSubCategoryById(int id)
        {
            var subCategory = unit.SubCategoryRepository.GetById(id);
            if (subCategory == null)
            {
                return NotFound();
            }
            var subCat = mapper.Map<SubCategoryDTO>(subCategory);
            return Ok(subCat);
        }
        [HttpGet("{name:alpha}")]
        public IActionResult GetSubCategoryByName(string name)
        {
            var subCategory = unit.SubCategoryRepository.GetByName(name);
            if (subCategory == null)
            {
                return NotFound();
            }
            var subCat = mapper.Map<SubCategoryDTO>(subCategory);
            return Ok(subCat);
        }
     
    }
}
