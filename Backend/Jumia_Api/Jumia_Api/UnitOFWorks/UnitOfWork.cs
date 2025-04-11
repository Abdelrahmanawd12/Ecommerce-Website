using Jumia.Data;
using Jumia.Models;
using Jumia_Api.Repository;
namespace Jumia_Api.UnitOFWorks
{
    public class UnitOFWork
    {
        JumiaDbContext db;
        ProductsRepository productsRepository;
        CategoryRepository categoryRepository;
        GenericRepository<Cart> cartRepository;
        SubCategoryRepository subCategoryRepository;
        public UnitOFWork(JumiaDbContext context)
        {
            db = context;
        }
        public ProductsRepository ProductsRepository
        {
            get
            {
                if (productsRepository == null)
                {
                    productsRepository = new ProductsRepository(db);
                }
                return productsRepository;
            }
        }
        public CategoryRepository CategoryRepository
        {
            get
            {
                if (categoryRepository == null)
                {
                    categoryRepository = new CategoryRepository(db);
                }
                return categoryRepository;
            }
        }
        public GenericRepository<Cart> CartRepository
        {
            get
            {
                if (cartRepository == null)
                {
                    cartRepository = new GenericRepository<Cart>(db);
                }
                return cartRepository;
            }
        }
        public SubCategoryRepository SubCategoryRepository
        {
            get
            {
                if (subCategoryRepository == null)
                {
                    subCategoryRepository = new SubCategoryRepository(db);
                }
                return subCategoryRepository;
            }
        }
        public void Save()
        {
            db.SaveChanges();
        }
    }
}
