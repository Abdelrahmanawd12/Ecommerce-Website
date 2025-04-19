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
            return db.Products.FirstOrDefault(p => p.Name == name);
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
                    keywords.Any(k =>
                        p.Name.Contains(k, StringComparison.OrdinalIgnoreCase) ||
                        p.ProductTags.Any(tag => tag.Tag.Contains(k, StringComparison.OrdinalIgnoreCase))))
                .ToList();
        }
    }

}
