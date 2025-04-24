using Jumia.Data;
using Jumia.Models;
using Stripe;
using Customer = Jumia.Models.Customer;

namespace Jumia_Api.Repository
{
    public class CustomerRepository : GenericRepository<Customer>
    {
        public CustomerRepository(JumiaDbContext context):base(context) { }

        public Customer GetCustomerById(string id)
        {
            return (Customer)db.Users.FirstOrDefault(u => u.Id == id);
        }
    }
}
