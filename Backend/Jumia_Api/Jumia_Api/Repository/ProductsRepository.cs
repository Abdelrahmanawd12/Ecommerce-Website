using Jumia.Data;
using Jumia.Models;

namespace Jumia_Api.Repository
{
    public class ProductsRepository:GenericRepository<Product>
    {
        public ProductsRepository(JumiaDbContext context) : base(context)
        {
        }
        public Product getByName(string name)
        {
            return db.Products.FirstOrDefault(p => p.Name == name);
        }
    }
    
}
