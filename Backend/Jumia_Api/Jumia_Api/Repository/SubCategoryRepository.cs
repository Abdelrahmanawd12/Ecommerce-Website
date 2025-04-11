using Jumia.Data;
using Jumia.Models;

namespace Jumia_Api.Repository
{
    public class SubCategoryRepository:GenericRepository<SubCategory>
    {
        public SubCategoryRepository(JumiaDbContext context) : base(context)
        {
        }
        public SubCategory GetByName(string name)
        {
            return db.SubCategories.FirstOrDefault(p => p.SubCatName == name);
        }

    }
    

    
}
