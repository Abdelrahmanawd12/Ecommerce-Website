using AutoMapper;
using Jumia.Models;
using Jumia_Api.DTOs.CustomerDTOs;
using Jumia_Api.DTOs.SellerDTOs;
using Jumia_Api.Models;
using Jumia_Api.Repository;
using Jumia_Api.UnitOFWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        //----------------------------------------------------------------------------------------
        //get subcategories by category name 
        [HttpGet("/subcategories")] //[/subcategories]
        [ProducesResponseType(200, Type = typeof(SubCategoryDTO))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Get Subcategories of a category")]
        [EndpointDescription("Get Subcategories by category name")]
        public IActionResult GetSubcategories(string catName)
        {
            if(string.IsNullOrWhiteSpace(catName))
        return BadRequest("Category name is required.");

            var subCats = unit.SubCategoryRepository.GetAll()
                                .Where(c => c.Category.CatName == catName)
                                .ToList();

            if (subCats == null || !subCats.Any())
            {
                return NotFound("No subcategories found for the given category name.");
            }

            var subDto = mapper.Map<List<SubCategoryDTO>>(subCats);

            return Ok(subDto);
        }

        //----------------------------------------------------------------------------------------
        //Get All Cateogries
        [HttpGet("/getallCategories")]
        [ProducesResponseType(200, Type = typeof(CategoryDTO))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Get All Categories")]
        [EndpointDescription("Get All Categories")]
        public IActionResult GetAllCat()
        {
            var cats = unit.CategoryRepository.GetAll();

            if (cats == null || !cats.Any())
            {
                return NotFound("No categories found.");
            }

            var catsDto = mapper.Map<List<CategoryDTO>>(cats);

            return Ok(catsDto);
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
        //----------------------------------------------------------------------------------
        //Add Product 
        [HttpPost("/addProduct")]  // [/addProduct]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(200, Type = typeof(ProductsSellerDTO))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Add New Product")]
        [EndpointDescription("Add New Product to specific seller")]
        public async Task<IActionResult> AddProduct([FromForm] AddProduct dto)
        {
            var imagePaths = new List<string>();

            if (dto.ImageUrls != null && dto.ImageUrls.Count > 0)
            {
                foreach (var image in dto.ImageUrls)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                    var filePath = Path.Combine("wwwroot/images", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    imagePaths.Add("/images/" + fileName); 
                }
            }

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Quantity = dto.Quantity,
                Brand = dto.Brand,
                Discount = dto.Discount,
                Weight = dto.Weight,
                SubCategoryId = dto.SubCategoryId,
                SellerId = dto.SellerId,
                ProductImages = imagePaths.Select(p => new ProductImage { Url = p }).ToList(),
                ProductTags = dto.Tags.Select(t => new ProductTag { Tag = t }).ToList()
            };
            unit.ProductsRepository.Add(product);
            unit.Save();

            return Ok("Product added successfully");
        }

        //-------------------------------------------------------------------------------------
        //Edit Product
        [HttpPut("/updateProduct/{id}")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(200, Type = typeof(ProductsSellerDTO))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Update Product")]
        [EndpointDescription("Update Product by productId")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] AddProduct dto)
        {
            var product = unit.ProductsRepository.GetById(id);

            if (product == null)
                return NotFound("Product not found");

            var imagePaths = new List<string>();
            if (dto.ImageUrls != null && dto.ImageUrls.Count > 0)
            {
                foreach (var image in dto.ImageUrls)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                    var filePath = Path.Combine("wwwroot/images", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    imagePaths.Add("/images/" + fileName);
                }

                product.ProductImages.Clear();
                product.ProductImages = imagePaths.Select(p => new ProductImage { Url = p }).ToList();
            }

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Quantity = dto.Quantity;
            product.Brand = dto.Brand;
            product.Discount = dto.Discount;
            product.Weight = dto.Weight;
            product.SubCategoryId = dto.SubCategoryId;
            product.SellerId = dto.SellerId;

            product.ProductTags.Clear();
            product.ProductTags = dto.Tags.Select(t => new ProductTag { Tag = t }).ToList();

            unit.ProductsRepository.Update(product);
            unit.Save();

            return Ok("Product updated successfully");
        }


    }
}
