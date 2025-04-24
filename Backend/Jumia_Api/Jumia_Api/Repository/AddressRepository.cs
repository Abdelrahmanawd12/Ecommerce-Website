using Jumia.Data;
using Microsoft.EntityFrameworkCore;
using Jumia.Models;

namespace Jumia_Api.Repository
{
    public class AddressRepository :GenericRepository<Address>
    {
        public AddressRepository(JumiaDbContext context):base(context) { }

        public IEnumerable<Address> GetAddressesByCustomerId(string customerId)
        {
            return (IEnumerable<Address>)db.Addresses.Where(a => a.UserId == customerId).ToList();
        }

        
    }
}
