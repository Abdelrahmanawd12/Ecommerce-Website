using Jumia.Data;
using Jumia.Models;
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
        public async Task<IActionResult> GetAddressBook(string customerId)
        {
            customerId = customerId.Trim(); // تأكد من إزالة الفراغات

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == customerId);
            if (user == null)
                return NotFound("User not found.");

            var address = await _context.Addresses.FirstOrDefaultAsync(a => a.UserId == customerId);

            var result = new AddressBookDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Street = address?.Street ?? "",
                City = address?.City ?? "",
                Country = address?.Country ?? ""
            };

            return Ok(result);
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

            var address = await _context.Addresses.FirstOrDefaultAsync(a => a.UserId == customerId);

            if (address != null)
            {
                // Update existing address
                address.Street = dto.Street;
                address.City = dto.City;
                address.Country = dto.Country;
            }
            else if (!string.IsNullOrWhiteSpace(dto.Street) || !string.IsNullOrWhiteSpace(dto.City) || !string.IsNullOrWhiteSpace(dto.Country))
            {
                // Create address only if there’s data entered
                var newAddress = new Address
                {
                    UserId = customerId,
                    Street = dto.Street,
                    City = dto.City,
                    Country = dto.Country
                };
                _context.Addresses.Add(newAddress);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }



    }
}
