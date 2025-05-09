﻿using System.ComponentModel.DataAnnotations;
using Jumia.Models;

namespace Jumia_Api.DTOs.AuthenticationDTOs.RegisterDTOs
{
    public class CustomerRegisterDTO
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }

        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }

        [Required]
        public string PhoneNumber { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public bool IsDeleted = false;
    }
}
