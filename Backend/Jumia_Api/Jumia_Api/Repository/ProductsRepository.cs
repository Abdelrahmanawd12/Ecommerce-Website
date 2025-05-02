using Jumia.Data;
using Jumia.Models;
using Microsoft.EntityFrameworkCore;

namespace Jumia_Api.Repository
{
    public class ProductsRepository : GenericRepository<Product>
    {
        public ProductsRepository(JumiaDbContext context) : base(context)
        {
        }

        public Product getByName(string name)
        {
            return db.Products.Where(p => p.Status == "accepted" && p.IsDeleted == false).FirstOrDefault(p => p.Name == name);
        }
        public Product getById(int id)
        {
            return db.Products.Where(p => p.Status == "accepted" && p.IsDeleted == false).FirstOrDefault(p => p.ProductId == id);
        }


        //-----------------------------------------------------------
        //Search HomePage
        public IEnumerable<Product> SearchByQuery(string query)
        {
            var keywords = query
                .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

            return db.Products
                .Include(p => p.ProductTags)
                .AsEnumerable()
               .Where(p =>
                    p.Status == "Accepted" &&
                    !p.IsDeleted &&
                    keywords.Any(k =>
                        p.Name.Contains(k, StringComparison.OrdinalIgnoreCase) ||
                        p.ProductTags.Any(tag => tag.Tag.Contains(k, StringComparison.OrdinalIgnoreCase))
                    )
                ).ToList();
                        }

        //----------------------------------------------------------------
        //Delete Image From Product 
        public async Task<bool> DeleteImagesFromProductAsync(int productId, List<string> imageUrls)
        {
            var product = await db.Products
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
            {
                return false;
            }

            foreach (var imageUrl in imageUrls)
            {
                var image = product.ProductImages.FirstOrDefault(img => img.Url == imageUrl);
                if (image != null)
                {
                    product.ProductImages.Remove(image);
                }
            }

            db.Products.Update(product);
            return true;
        }

    }

}