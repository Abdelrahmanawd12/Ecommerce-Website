using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Jumia.Data;
using Jumia.Models;
using Jumia_Api.DTOs.CustomerDTOs;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Jumia_Api.Repository;
using Jumia_Api.UnitOFWorks;


namespace Jumia_Api.Controllers.CustomerControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        //ProductsRepository repo;
        UnitOFWork unit;
        IMapper mapper;
        public ProductsController(UnitOFWork _unit, IMapper _mapper)
        {
            //repo = context;
            unit = _unit;
            mapper = _mapper;
        }
        [HttpGet]
        public IActionResult GetAllProducts()
        {
            var products = unit.ProductsRepository.GetAll().Where(p=>p.Status=="Accepted"&&p.IsDeleted==false); 

            var product = mapper.Map<List<ProductsDTO>>(products);
            return Ok(product);
        }

        [HttpGet("{id}")]

        public IActionResult GetProductById(int id)
        {
            var product = unit.ProductsRepository.getById(id) ;
            if (product == null)
            {
                return NotFound();
            }
            var products = mapper.Map<ProductsDTO>(product);
            return Ok(products);
        }
        [HttpGet("{name:alpha}")]
        public IActionResult GetProductByName(string name)
        {
            var product = unit.ProductsRepository.getByName(name);
            if (product == null)
            {
                return NotFound();
            }
          var products = mapper.Map<ProductsDTO>(product);
            return Ok(products);
        }
        //-------------------------------------------------------------------------
        [HttpGet("search")]
        public IActionResult SearchProducts([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Search query cannot be empty");

            var products = unit.ProductsRepository.SearchByQuery(query);

            var filtered = products
                .Where(p =>
                    p.Name.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                    p.ProductTags.Any(tag => tag.Tag.Contains(query, StringComparison.OrdinalIgnoreCase)))
                .ToList();

            var result = mapper.Map<List<ProductsDTO>>(filtered);

            return Ok(result);
        }





    }
}
