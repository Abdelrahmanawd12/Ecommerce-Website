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
            return db.Products.Where(p => p.Status == "accepted" && p.IsDeleted == false).FirstOrDefault(p => p.Name == name);
        }
        public Product getById(int id)
        {
            return db.Products.Where(p => p.Status == "accepted" && p.IsDeleted == false).FirstOrDefault(p => p.ProductId == id);
        }

    }
    
}
