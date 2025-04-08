using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Jumia.Data;
using Jumia.Models;
using Jumia_Api.DTOs.CustomerDTOs;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Jumia_Api.Repository;


namespace Jumia_Api.Controllers.CustomerControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        ProductsRepository repo;
        IMapper mapper;
        public ProductsController(ProductsRepository context,IMapper _mapper)
        {
            repo = context;
            mapper = _mapper;
        }
        [HttpGet]
        public IActionResult GetAllProducts()
        {
            var products = repo.GetAll(); //_context.Products.ToList();
            var product = mapper.Map<List<ProductsDTO>>(products);
            return Ok(product);

            //List<ProductsDTO> productsDTO = new List<ProductsDTO>();
            //foreach (var item in products)
            //{
            //    var productDTO = new ProductsDTO
            //    {
            //        ProductId = item.ProductId,
            //        Name = item.Name,
            //        Description = item.Description,
            //        Price = item.Price,
            //        Brand = item.Brand,
            //        Quantity = item.Quantity,
            //        Weight = item.Weight,
            //        Discount = item.Discount,
            //        CategoryName = item.Category != null ? item.Category.CatName : "Unknown",
            //        ImageUrls = item.ProductImages.Select(pi => pi.Url).ToList(),
            //        Tags = item.ProductTags.Select(pt => pt.Tag).ToList()
            //    };

            //    productsDTO.Add(productDTO);
            //}

        }

        [HttpGet("{id}")]
  
        public IActionResult GetProductById(int id)
        {

            var product = repo.GetById(id);//_context.Products.FirstOrDefault(p => p.ProductId == id);
            if (product == null)
            {
                return NotFound();
            }
            var products=mapper.Map<ProductsDTO>(product);
            return Ok(products);
       

            //var productDTO = new ProductsDTO
            //{
            //    ProductId = product.ProductId,
            //    Name = product.Name,
            //    Description = product.Description,
            //    Price = product.Price,
            //    Brand = product.Brand,
            //    Quantity = product.Quantity,
            //    Weight = product.Weight,
            //    Discount = product.Discount,
            //    CategoryName = product.Category?.CatName ?? "Unknown",
            //    ImageUrls = product.ProductImages?.Select(pi => pi.Url).ToList() ?? new List<string>(),
            //    Tags = product.ProductTags?.Select(pt => pt.Tag).ToList() ?? new List<string>()
            //};

            //return Ok(productDTO);
        }



    }
}
