using Jumia.Data;
using Jumia.Models;

namespace Jumia_Api.Repository
{
    public class SellerRepository : GenericRepository<Seller>
    {
        public SellerRepository(JumiaDbContext context) : base(context)
        {
        }

        public Seller GetSellerById(string id)
        {
            return (Seller)db.Users.FirstOrDefault(u => u.Id == id);
        }
    }
}
