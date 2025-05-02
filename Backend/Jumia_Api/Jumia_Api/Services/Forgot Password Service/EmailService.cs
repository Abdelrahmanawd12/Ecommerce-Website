using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;
using Jumia_Api.DTOs.AuthenticationDTOs.RegisterDTOs;
using System.Collections.Concurrent;

namespace Jumia_Api.Services.Forgot_Password_Service
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        // Temporary storage for OTPs (In production, use a proper cache or DB)
        private readonly ConcurrentDictionary<string, OtpEntryDTO> _otpStore = new();
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var email = new MimeMessage();

                email.From.Add(new MailboxAddress("Yasmine - Jumia Support", "yasminrapea609@gmail.com"));

                email.ReplyTo.Add(new MailboxAddress("Yasmine Support", "yasminrapea609@gmail.com"));

                email.To.Add(MailboxAddress.Parse(toEmail));
                email.Subject = subject;

                var builder = new BodyBuilder
                {
                    HtmlBody = $@"
<html>
<body style='font-family: Arial, sans-serif;'>
    <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 8px;'>
        <h2 style='text-align: center; color: #ff6b00;'>Hello,</h2>
        <p style='font-size: 16px; color: #555;'>We received a request to reset your password. If this was you, click the button below to reset your password.</p>
        <p style='font-size: 16px; color: #555;'>If you did not request this, please ignore this email.</p>
        <div style='text-align: center; margin-top: 30px;'>
            <a href='{body}' style='background-color: #ff6b00; color: white; padding: 15px 25px; font-size: 18px; text-decoration: none; border-radius: 5px;'>Reset Password</a>
        </div>
        <p style='text-align: center; font-size: 14px; color: #777; margin-top: 20px;'>Best regards,<br/>Yasmine from Jumia Support Team</p>
    </div>
</body>
</html>
",
                    TextBody = "Click the following link to reset your password: " + body
                };



                email.Body = builder.ToMessageBody();

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync("yasminrapea609@gmail.com", "nflcfepgbsyfftmv");
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                Console.WriteLine("✅ Email sent successfully to: " + toEmail);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Error sending email: " + ex.Message);
                return false;
            }
        }




        // Generate a random OTP (6 digits)
        private string GenerateOtp()
        {
            Random random = new Random();
            return random.Next(100000, 999999).ToString(); // Generates a 6-digit OTP
        }

        // Save OTP for later verification
        public void SaveOtp(string email, string otp)
        {
            var otpEntry = new OtpEntryDTO
            {
                Email = email,
                Code = otp,
                CreatedAt = DateTime.UtcNow,
                IsUsed = false
            };

            _otpStore[email.ToLower()] = otpEntry;
        }

        // Get OTP by email
        public OtpEntryDTO GetOtpByEmail(string email)
        {
            _otpStore.TryGetValue(email.ToLower(), out var otpEntry);
            return otpEntry;
        }

        // Mark OTP as used
        public void MarkOtpAsUsed(string email)
        {
            if (_otpStore.TryGetValue(email.ToLower(), out var otpEntry))
            {
                otpEntry.IsUsed = true;
            }
        }

        // Verify the OTP entered by the user
        // Verify OTP entered by the user
        public bool VerifyOtp(string email, string enteredOtp)
        {
            var otpEntry = GetOtpByEmail(email);

            if (otpEntry == null)
                return false;

            if (otpEntry.IsUsed)
                return false;

            if (otpEntry.Code != enteredOtp)
                return false;

            if ((DateTime.UtcNow - otpEntry.CreatedAt).TotalMinutes > 15)
                return false;

            MarkOtpAsUsed(email);
            return true;
        }

        // Send OTP email to the user
        public async Task<bool> SendOtpAsync(string toEmail)
        {
            try
            {
                var otp = GenerateOtp(); // Generate OTP

                var email = new MimeMessage();

                email.From.Add(new MailboxAddress("Yasmine - Jumia Support", "yasminrapea609@gmail.com"));
                email.ReplyTo.Add(new MailboxAddress("Yasmine Support", "yasminrapea609@gmail.com"));

                email.To.Add(MailboxAddress.Parse(toEmail));
                email.Subject = "Your OTP Code for Email Verification";

                var builder = new BodyBuilder
                {
                    HtmlBody = $@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Email Verification</title>
</head>
<body style='font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9;'>
    <div style='max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);'>
        <h2 style='text-align: center; color: #ff6b00;'>Hello,</h2>
        <p style='font-size: 16px; color: #333;'>We received a request to verify your email. Here is your verification code:</p>
        <h3 style='text-align: center; font-size: 28px; color: #ff6b00; margin: 20px 0;'>{otp}</h3>
        <p style='font-size: 16px; color: #333;'>Please enter this code on the verification page. This code is valid for 15 minutes.</p>
        <p style='font-size: 14px; color: #777; text-align: center; margin-top: 30px;'>Best regards,<br/>Yasmine from Jumia Support Team</p>
    </div>
</body>
</html>",
                    TextBody = "Your OTP verification code is: " + otp
                };

                email.Body = builder.ToMessageBody();

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync("yasminrapea609@gmail.com", "ytzuafatfgxbecan");
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                Console.WriteLine("✅ OTP sent successfully to: " + toEmail);

                SaveOtp(toEmail, otp); // Save OTP after sending
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Error sending OTP email: " + ex.Message);
                return false;
            }
        }
    }
}

