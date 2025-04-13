using Jumia.Data;
using Jumia.Models;

namespace Jumia_Api.Repository
{
    public class CategoryRepository:GenericRepository<Category>
    {
        public CategoryRepository(JumiaDbContext context) : base(context)
        {
        }
        public Category GetByName(string name)
        {
            return db.Categories.FirstOrDefault(p => p.CatName == name);
        }

    }
    
}
