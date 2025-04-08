using Jumia.Data;

namespace Jumia_Api.Repository
{
    public class GenericRepository<TEntity> where TEntity : class
    {
        public JumiaDbContext db;
        public GenericRepository(JumiaDbContext context)
        {
            db = context;
        }
        public List<TEntity> GetAll()
        {
            return db.Set<TEntity>().ToList();
        }
        public TEntity GetById(int id)
        {
            return db.Set<TEntity>().Find(id);
        }
        public void Add(TEntity entity)
        {
            db.Set<TEntity>().Add(entity);
        }
        public void Update(TEntity entity)
        {
            db.Set<TEntity>().Update(entity);
        }
        public void Delete(int id)
        {
            TEntity entity = GetById(id);
            db.Remove(entity);
        }
        public void Save()
        {
            db.SaveChanges();
        }
    }
}
