using Jumia.Models;
using Microsoft.AspNetCore.Identity;

namespace Jumia_Api.Services.Admin_Service
{
    public class CustomUserValidator<TUser> : UserValidator<TUser> where TUser : IdentityUser
    {
        public override async Task<IdentityResult> ValidateAsync(UserManager<TUser> manager, TUser user)
        {
            var result = await base.ValidateAsync(manager, user);

           
            if (result.Errors.Any(e => e.Code == "DuplicateUserName"))
            {
                var existingUser = await manager.FindByNameAsync(user.UserName);
                if (existingUser != null && ((ApplicationUser)(object)existingUser).IsDeleted)
                {
                    result = new IdentityResult();
                }
            }

            return result;
        }
    }
    
    }

