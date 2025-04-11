using AutoMapper;
using Jumia.Models;
using Jumia_Api.DTOs.SellerDTOs;
using Jumia_Api.Repository;
using Jumia_Api.UnitOFWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Jumia_Api.Controllers.SellerControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SellerController : ControllerBase
    {
        UnitOFWork unit;
        IMapper mapper;
        public SellerController(UnitOFWork unit, IMapper mapper)
        {
            this.unit = unit;
            this.mapper = mapper;
        }

        //-----------------------------------------------------------------------------------------
        //Get All Products
        [HttpGet("/products")] //[/products]
        [ProducesResponseType(200, Type = typeof(ProductsSellerDTO))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Get All Seller's Products")]
        [EndpointDescription("Get All Products By of Seller by Seller ID")]
        public IActionResult GetAllProducts(string SellerId)
        {
            if (string.IsNullOrWhiteSpace(SellerId))
            {
                return BadRequest("SellerId is required.");
            }

            var products = unit.ProductsRepository.GetAll().Where(p => p.SellerId == SellerId).ToList();

            var dto = mapper.Map<List<ProductsSellerDTO>>(products);

            if (products == null || !products.Any())
            {
                return NotFound("No products found for the specified seller.");
            }

            return Ok(dto);
        }

        //-----------------------------------------------------------------------------------------
        //Get Product By Id
        [HttpGet("/products/{id}")] //[/products/{id}]
        [ProducesResponseType(200, Type = typeof(ProductsSellerDTO))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [EndpointSummary("Get Specific Product")]
        [EndpointDescription("Get Product By Product Id And Seller Id")]
        public IActionResult GetProductById(string SellerId, int ProdId)
        {
            var product = unit.ProductsRepository.GetById(ProdId);
            var dto = mapper.Map<ProductsSellerDTO>(product);



            if (product == null)
            {
                return NotFound("Product not found.");
            }

            if (product.SellerId != SellerId)
            {
                return Unauthorized("The product does not belong to the specified seller.");
            }

            return Ok(dto);
        }

        //-----------------------------------------------------------------------------------------
        //Get Product By Name
        [HttpGet("/productsname")] //[/productsname]
        [ProducesResponseType(200, Type = typeof(ProductsSellerDTO))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Get Product By Name")]
        [EndpointDescription("Get Product By Product Name And Seller Id")]
        public IActionResult GetProductByName(string SellerId, string ProdName)
        {
            var product = unit.ProductsRepository.getByName(ProdName);

            var dto = mapper.Map<ProductsSellerDTO>(product);

            if (product == null)
            {
                return NotFound("Product not found.");
            }

            if (product.SellerId != SellerId)
            {
                return Unauthorized("The product does not belong to the specified seller.");
            }

            return Ok(dto);
        }

        //-----------------------------------------------------------------------------------------
        //Delete Product By Id
        [HttpDelete("/delete/{id}")] //[/delete/{id}]
        [ProducesResponseType(200, Type = typeof(ProductsSellerDTO))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Delete Product By Id")]
        [EndpointDescription("Delete Seller Product By Id")]
        public IActionResult DeleteProductById(string SellerId, int ProdId)
        {
            if (string.IsNullOrWhiteSpace(SellerId))
            {
                return BadRequest("SellerId is required.");
            }

            var product = unit.ProductsRepository.GetById(ProdId);

            if (product == null)
            {
                return NotFound("Product not found.");
            }

            if (product.SellerId != SellerId)
            {
                return Unauthorized("The product does not belong to the specified seller.");
            }

            unit.ProductsRepository.Delete(ProdId);
            unit.Save();

            return Ok("Product deleted successfully.");
        }
    }
}
