﻿using AutoMapper;
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
        [HttpGet("/products")]
        [ProducesResponseType(200, Type = typeof(ProductsSellerDTO))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Get All Seller's Products")]
        [EndpointDescription("Get All Products By Seller ID where isDeleted = false")]
        public IActionResult GetAllProducts(string SellerId)
        {
            if (string.IsNullOrWhiteSpace(SellerId))
            {
                return BadRequest("SellerId is required.");
            }

            var products = unit.ProductsRepository.GetAll()
                                    .Where(p => p.SellerId == SellerId && p.IsDeleted == false)
                                    .ToList();

            if (products == null || !products.Any())
            {
                return NotFound("No products found for the specified seller.");
            }

            var dto = mapper.Map<List<ProductsSellerDTO>>(products);

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
            if (string.IsNullOrWhiteSpace(catName))
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
        //Get All SubCategories
        [HttpGet("/getAllSubcategories")]
        [ProducesResponseType(200, Type = typeof(SubCategoryDTO))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Get All Subcategories")]
        [EndpointDescription("Get All Subcategories")]
        public IActionResult GetAllSubs()
        {
            var subs = unit.SubCategoryRepository.GetAll();

            if (subs == null || !subs.Any())
            {
                return NotFound("No categories found.");
            }

            var catsDto = mapper.Map<List<SubCategoryDTO>>(subs);

            return Ok(catsDto);
        }

        //---------------------------------------------------------------------------------------
        //Get All categories
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Get All Categories")]
        [EndpointDescription("Return All Categories")]
        [HttpGet("/allcat")]
        public IActionResult GetAllCats()
        {
            var categories = unit.CategoryRepository.GetAll()
                .Select(cat => new CategoryDTO
                {
                    Id = cat.CatId,
                    Name = cat.CatName,
                    Subcategory = cat.SubCategories.Select(sub => new SubCategoryDTO
                    {
                        SubCatId = sub.SubCatId,
                        SubCatName = sub.SubCatName,
                        CategoryName = cat.CatName
                    }).ToList()
                })
                .ToList();

            if (categories == null || categories.Count == 0)
                return NotFound();

            return Ok(categories);
        }


        //---------------------------------------------------------------------------------------
        //Get All SubCategories by Category Id
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Get All SubCategories")]
        [EndpointDescription("Return All SubCategories by Category Id")]
        [HttpGet("/allsubcat")]
        public IActionResult GetAllSubCats(int categoryId)
        {
            var subCategories = unit.SubCategoryRepository.GetAll()
                .Where(sc => sc.CatId == categoryId)
                .Select(sc => new SubCategoryDTO
                {
                    SubCatId = sc.SubCatId,
                    SubCatName = sc.SubCatName,
                    CategoryName = sc.Category.CatName
                })
                .ToList();

            if (subCategories == null || subCategories.Count == 0)
                return NotFound();

            return Ok(subCategories);
        }

        //-----------------------------------------------------------------------------------------
        //Delete Product By Id
        [HttpDelete("/delete/{prodId}")] //[/delete/{id}]
        [ProducesResponseType(200, Type = typeof(ProductsSellerDTO))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Mark Product as Deleted")]
        [EndpointDescription("Mark Seller Product as Deleted By Id")]
        public IActionResult DeleteProductById([FromQuery] string SellerId, [FromRoute(Name = "prodId")] int ProdId)
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

            product.IsDeleted = true;

            unit.ProductsRepository.Update(product);
            unit.Save();

            return Ok("Product has been marked as deleted successfully.");
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
                Status = dto.Status,
                SubCategoryId = dto.SubCategoryId,
                SellerId = dto.SellerId,
                ProductImages = imagePaths.Select(p => new ProductImage { Url = p }).ToList(),
                ProductTags = dto.Tags.Select(t => new ProductTag { Tag = t }).ToList(),
            };
            unit.ProductsRepository.Add(product);
            unit.Save();

            return Ok(new { message = "Product updated successfully" });
        }

        //-------------------------------------------------------------------------------------
        //Edit Product
        [HttpPut("/updateProduct/{id}")]
        [ProducesResponseType(200, Type = typeof(ProductsSellerDTO))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Update Product")]
        [EndpointDescription("Update Product by productId")]
        public IActionResult UpdateProduct(int id, [FromBody] UpdateProductInfoDTO dto)
        {
            var product = unit.ProductsRepository.GetById(id);

            if (product == null)
                return NotFound("Product not found");

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Quantity = dto.Quantity;
            product.Brand = dto.Brand;
            product.Discount = (decimal)dto.Discount;
            product.Weight = (decimal)dto.Weight;
            product.SubCategoryId = dto.SubCategoryId;
            product.SellerId = dto.SellerId;

            product.ProductTags.Clear();
            product.ProductTags = dto.Tags.Select(t => new ProductTag { Tag = t }).ToList();

            unit.ProductsRepository.Update(product);
            unit.Save();

            return Ok(new { message = "Product info updated successfully" });
        }
        //-----------------------------------------------------------------------------------------
        [Consumes("multipart/form-data")]
        [HttpPatch("/UpdateProductImages/{id}")]
        public async Task<IActionResult> UpdateProductImages(int id, [FromForm] UpdateProductImagesDto dto)
        {
            var product = unit.ProductsRepository.GetById(id);

            if (product == null)
                return NotFound("Product not found");

            if (dto.ImageUrls == null || dto.ImageUrls.Count == 0)
                return BadRequest("No images provided.");

            var imagePaths = new List<string>();

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


            foreach (var path in imagePaths)
            {
                product.ProductImages.Add(new ProductImage { Url = path });
            }

            unit.ProductsRepository.Update(product);
            unit.Save();

            return Ok(new { message = "Product images updated successfully" });
        }

        //------------------------------------------------------------------------
        [HttpDelete("/DeleteProductImages/{productId}")]
        public async Task<IActionResult> DeleteProductImages(int productId, [FromBody] List<string> imageUrls)
        {
            if (imageUrls == null || !imageUrls.Any())
            {
                return BadRequest("No images provided to delete");
            }

            var result = await unit.ProductsRepository.DeleteImagesFromProductAsync(productId, imageUrls);
            if (result)
            {
                unit.Save();
                return Ok("Images deleted successfully");
            }
            else
            {
                return BadRequest("Failed to delete images");
            }
        }

        //-------------------------------------------------------------------------------------
        //Get All Orders By Seller Id
        [HttpGet("/orders/{sellerId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Get All Orders")]
        [EndpointDescription("Get All Orders By Seller Id")]
        public IActionResult GetAllOrders(string sellerId)
        {
            var orders = unit.OrderRepository.GetAll().Where(s => s.SellerId == sellerId).ToList();

            if (orders == null || !orders.Any())
            {
                return NotFound($"No orders found for Seller Id: {sellerId}");
            }

            var ordersDto = mapper.Map<List<OrderDTO>>(orders);

            foreach (var order in ordersDto)
            {
                foreach (var item in order.OrderItems)
                {
                    var productImages = unit.ProductImgRepository.GetAll().Where(pi => pi.ProductId == item.ProductId).ToList();

                    item.ProductImages = mapper.Map<List<ProductImgDTO>>(productImages);
                }
            }

            return Ok(ordersDto);
        }

        //-------------------------------------------------------------------------------------
        //Get All Orders By Seller Id and data
        [HttpGet("/ordersByDate/{sellerId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Get Order By Date")]
        [EndpointDescription("Get Order By Date And Seller Id")]
        public IActionResult GetOrdersByDate(string sellerId, DateTime startDate, DateTime endDate)
        {
            if (startDate > endDate)
            {
                return BadRequest("Start date cannot be greater than end date.");
            }

            var orders = unit.OrderRepository.GetAll()
                .Where(s => s.SellerId == sellerId && s.OrderDate >= startDate && s.OrderDate <= endDate)
                .ToList();

            if (orders == null || !orders.Any())
            {
                return NotFound($"No orders found for Seller Id: {sellerId} between {startDate.ToShortDateString()} and {endDate.ToShortDateString()}");
            }

            var ordersDto = mapper.Map<List<OrderDTO>>(orders);
            foreach (var order in ordersDto)
            {
                foreach (var item in order.OrderItems)
                {
                    var productImages = unit.ProductImgRepository.GetAll().Where(pi => pi.ProductId == item.ProductId).ToList();

                    item.ProductImages = mapper.Map<List<ProductImgDTO>>(productImages);
                }
            }

            return Ok(ordersDto);
        }
        //-------------------------------------------------------------------------------------
        //Get Orders By Date 
        [HttpGet("/ordersByDate")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Get Orders By Date")]
        [EndpointDescription("Get Orders By Date And Seller Id")]
        public IActionResult GetOrdersBySpecificDate(string sellerId, DateTime date)
        {


            var orders = unit.OrderRepository.GetAll()
                .Where(s => s.SellerId == sellerId && s.OrderDate == date)
                .ToList();

            if (orders == null || !orders.Any())
            {
                return NotFound($"No orders found for Seller Id: {sellerId} and this date {date.ToShortDateString()} ");
            }

            var ordersDto = mapper.Map<List<OrderDTO>>(orders);
            foreach (var order in ordersDto)
            {
                foreach (var item in order.OrderItems)
                {
                    var productImages = unit.ProductImgRepository.GetAll().Where(pi => pi.ProductId == item.ProductId).ToList();

                    item.ProductImages = mapper.Map<List<ProductImgDTO>>(productImages);
                }
            }

            return Ok(ordersDto);
        }


        //-------------------------------------------------------------------------------------
        //Get Orders By Seller Id and Status
        [HttpGet("/ordersByStatus/{sellerId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Get Order By Status")]
        [EndpointDescription("Get Order By Status And Seller Id")]
        public IActionResult GetOrdersByStatus(string sellerId, string status)
        {
            if (string.IsNullOrEmpty(status))
            {
                return BadRequest("Status cannot be empty.");
            }

            var orders = unit.OrderRepository.GetAll()
                .Where(o => o.SellerId == sellerId && o.OrderStatus.Equals(status, StringComparison.OrdinalIgnoreCase))
                .ToList();

            if (orders == null || !orders.Any())
            {
                return NotFound($"No orders found for Seller Id: {sellerId} with status: {status}");
            }

            var ordersDto = mapper.Map<List<OrderDTO>>(orders);
            foreach (var order in ordersDto)
            {
                foreach (var item in order.OrderItems)
                {
                    var productImages = unit.ProductImgRepository.GetAll().Where(pi => pi.ProductId == item.ProductId).ToList();

                    item.ProductImages = mapper.Map<List<ProductImgDTO>>(productImages);
                }
            }

            return Ok(ordersDto);

        }

        //-------------------------------------------------------------------------------------
        //Get Order By Order Id
        [HttpGet("/orderById/{sellerId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Get Order By Order Id And Seller Id")]
        [EndpointDescription("Get Order By Order Id And Seller Id")]
        public IActionResult GetOrderById(string sellerId, int orderId)
        {
            if (string.IsNullOrEmpty(sellerId))
            {
                return BadRequest("Seller Id cannot be empty.");
            }

            var order = unit.OrderRepository.GetAll()
                .FirstOrDefault(o => o.SellerId == sellerId && o.OrderId == orderId);

            if (order == null)
            {
                return NotFound($"No order found for Seller Id: {sellerId} and Order Id: {orderId}");
            }

            var orderDto = mapper.Map<OrderDTO>(order);

            // Add Product Images for each item in the order
            foreach (var item in orderDto.OrderItems)
            {
                var productImages = unit.ProductImgRepository.GetAll()
                    .Where(pi => pi.ProductId == item.ProductId)
                    .ToList();

                item.ProductImages = mapper.Map<List<ProductImgDTO>>(productImages);
            }

            return Ok(orderDto);
        }
        //-------------------------------------------------------------------------------------
        //Update Status Only By Order Id And Seller Id
        [HttpPatch("/updateStatus")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [EndpointSummary("Update Order Status")]
        [EndpointDescription("Update Order Status By Order Id And Seller Id")]
        public IActionResult UpdateStatus([FromBody] UpdateOrderStatusRequestDTO request)
        {
            if (string.IsNullOrEmpty(request.SellerId) || string.IsNullOrEmpty(request.Status) || request.OrderId <= 0)
            {
                return BadRequest(new { message = "Invalid input data." });
            }

            var order = unit.OrderRepository.GetAll().FirstOrDefault(o => o.OrderId == request.OrderId && o.SellerId == request.SellerId);

            if (order == null)
            {
                return NotFound(new { message = $"Order with ID {request.OrderId} and Seller ID {request.SellerId} not found." });
            }

            if (request.Status == "delivered")
            {
                var paymentstatus = unit.PaymentRepository.GetAll().FirstOrDefault(p => p.OrderId == request.OrderId);
                if (paymentstatus != null)
                {
                    paymentstatus.Status = "Paid";
                }
            }

            if (request.Status == "pending" || request.Status == "ready" || request.Status == "shipped")
            {
                var paymentstatus = unit.PaymentRepository.GetAll().FirstOrDefault(p => p.OrderId == request.OrderId);
                if (paymentstatus != null)
                {
                    paymentstatus.Status = "Pending";
                }
            }

            if (request.Status == "canceled" || request.Status == "failed" || request.Status == "returned")
            {
                var paymentstatus = unit.PaymentRepository.GetAll().FirstOrDefault(p => p.OrderId == request.OrderId);
                if (paymentstatus != null)
                {
                    paymentstatus.Status = "Canceled";
                }
            }

            order.OrderStatus = request.Status;
            unit.Save();

            return Ok(new { message = $"Order status updated to {request.Status} for OrderId {request.OrderId}." });
        }

        //-------------------------------------------------------------------------------------
        // Delete Order By Order Id And Seller Id
        [HttpDelete("/deleteOrder")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Delete Order")]
        [EndpointDescription("Delete Order By Order Id And Seller Id")]
        public IActionResult DeleteOrderById(int orderId, string sellerId)
        {
            if (orderId <= 0 || string.IsNullOrEmpty(sellerId))
            {
                return BadRequest(new { message = "Invalid input data." });
            }

            var order = unit.OrderRepository.GetById(orderId);

            if (order == null || order.SellerId != sellerId)
            {
                return NotFound(new { message = $"Order with ID {orderId} and Seller ID {sellerId} not found." });
            }

            unit.OrderRepository.Delete(order.OrderId);
            unit.Save();

            return Ok(new { message = $"Order with ID {orderId} has been deleted." });
        }

        //----------------------------------------------------------------------------------------
        //Products Requests For Admin 
        [HttpGet("/request")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Requset Product For Admin Dashboard")]
        [EndpointDescription("When Seller Add Product it will go to Admin to Accept or Reject it")]

        public IActionResult RequestProducts()
        {
            var products = unit.ProductsRepository.GetAll()
                .Where(p => p.Status == "Pending" || p.Status == "pending").ToList();
            if (products == null || !products.Any())
            {
                return NotFound("No Pending products found ");
            }

            var dto = mapper.Map<List<ProductsSellerDTO>>(products);

            return Ok(dto);
        }
        //----------------------------------------------------------------------------------
        //Change Product Satus 
        [HttpPatch("/changeStatus")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesErrorResponseType(typeof(void))]
        [EndpointSummary("Change Product Status From Admin Dashboard")]
        [EndpointDescription("Change Product Status from Admin Dashboard")]
        public IActionResult ChangeProductStatus(int productId, [FromBody] string newStatus)
        {
            var product = unit.ProductsRepository.GetById(productId);
            if (product == null)
            {
                return NotFound("Product not found");
            }

            var validStatuses = new List<string> { "Pending", "Accepted", "Rejected" };
            if (!validStatuses.Contains(newStatus, StringComparer.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid status");
            }

            product.Status = newStatus;

            unit.ProductsRepository.Update(product);
            unit.Save();

            return Ok("Product status updated successfully");
        }


    }
}