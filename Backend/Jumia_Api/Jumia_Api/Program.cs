using System.Text;
using Jumia.Data;
using Jumia.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Jumia_Api.MapperConfig;
using Jumia_Api.Repository;
using Jumia_Api.UnitOFWorks;


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




            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
               .AddEntityFrameworkStores<JumiaDbContext>();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(txt, builder =>
                {
                    builder.AllowAnyOrigin();
                    builder.AllowAnyMethod();
                    builder.AllowAnyHeader();
                });
            });
            //[authorize] check using JWT token
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
                    ValidAudience = builder.Configuration["JWT:ValidAudience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"]))
                };
            });
            var app = builder.Build();

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

            app.Run();
        }
    }
}
