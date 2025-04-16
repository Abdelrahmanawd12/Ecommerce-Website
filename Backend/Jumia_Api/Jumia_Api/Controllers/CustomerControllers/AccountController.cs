using Jumia.Data;
using Jumia_Api.DTOs.CustomerDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jumia_Api.Controllers.CustomerControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JumiaDbContext _context;

        public AccountController(JumiaDbContext context)
        {
            _context = context;
        }

        //user1
        // GET: api/account/details/{customerId}
        [HttpGet("details/{customerId}")]
        public async Task<ActionResult<AccountDetailsDto>> GetAccountDetails(string customerId)
        {
            var user = await _context.Users
                .Where(u => u.Id == customerId)
                .Select(u => new AccountDetailsDto
                {
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    Gender = u.Gender,
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound();

            return Ok(user);
        }






        // GET: api/account/address-book/{customerId}
        [HttpGet("address-book/{customerId}")]
        public async Task<ActionResult<AddressBookDto>> GetAddressBook(string customerId)
        {
            // Get user by ID
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == customerId);
            if (user == null)
                return NotFound("User not found.");

            // Manually fetch the address using the UserId FK
            var address = await _context.Addresses.FirstOrDefaultAsync(a => a.UserId == customerId);
            if (address == null)
                return NotFound("No address found.");

            var dto = new AddressBookDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Street = address.Street,
                City = address.City,
                Country = address.Country
            };

            return Ok(dto);
        }










        [HttpPut("address-book/{customerId}")]
        public async Task<IActionResult> UpdateAddressBook(string customerId, AddressBookDto dto)
        {
            var customer = await _context.Users.FirstOrDefaultAsync(c => c.Id == customerId);
            if (customer == null)
                return NotFound("User not found.");

            // Update user info
            customer.FirstName = dto.FirstName;
            customer.LastName = dto.LastName;
            customer.PhoneNumber = dto.PhoneNumber;

            // Manually fetch the address using UserId
            var address = await _context.Addresses.FirstOrDefaultAsync(a => a.UserId == customerId);
            if (address != null)
            {
                address.Street = dto.Street;
                address.City = dto.City;
                address.Country = dto.Country;
            }
            else
            {
                return NotFound("No address found to update.");
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
