using System.Text;
using Jumia.Data;
using Jumia.Models;
using Jumia_Api.Services.Admin_Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Jumia_Api.MapperConfig;
using Jumia_Api.Repository;
using Jumia_Api.UnitOFWorks;
using Jumia_Api.Services.StripeService;
using Jumia_Api.Services;

using PayPalCheckoutSdk.Core;
using Jumia_Api.Services.PayPalService;


namespace Jumia_Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            string txt = "";
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            builder.Services.AddDbContext<JumiaDbContext>(options =>
                options.UseLazyLoadingProxies().UseSqlServer(builder.Configuration.GetConnectionString("con1")));
            builder.Services.AddAutoMapper(typeof(AutoMapperConfig));
            builder.Services.AddScoped<UnitOFWork>();
            builder.Services.AddScoped<StripeService>();

            // Configure Identity only once
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.User.RequireUniqueEmail = false;
            })
            .AddEntityFrameworkStores<JumiaDbContext>()
            .AddDefaultTokenProviders()
            .AddUserValidator<CustomUserValidator<ApplicationUser>>();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(txt, builder =>
                {
                    builder.AllowAnyOrigin();
                    builder.AllowAnyMethod();
                    builder.AllowAnyHeader();
                });
            });

            // Configure JWT Authentication
            builder.Services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(option =>
            {
                option.SaveToken = true;
                option.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidAudience = builder.Configuration["JWT:ValidAudience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"]))
                };
            });

            builder.Services.AddScoped<IAdminService, AdminService>();


            builder.Services.AddScoped<PayPalService>();
            builder.Services.AddSingleton<PayPalHttpClient>(provider =>
            {
                var config = provider.GetRequiredService<IConfiguration>();
                var environment = new SandboxEnvironment(
                    config["PayPal:ClientId"],
                    config["PayPal:SecretKey"]
                );
                return new PayPalHttpClient(environment);
            });




            var app = builder.Build();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwaggerUI(op => op.SwaggerEndpoint("/openapi/v1.json", "v1"));
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseCors(txt);
            app.MapControllers();
            app.UseStaticFiles();

            app.Run();
        }
    }
}
