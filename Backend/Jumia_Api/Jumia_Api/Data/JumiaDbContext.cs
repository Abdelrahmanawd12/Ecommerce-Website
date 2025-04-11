using Jumia.Models;
using Jumia_Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Jumia.Data
{
    public class JumiaDbContext : IdentityDbContext<ApplicationUser>
    {
        public JumiaDbContext(DbContextOptions<JumiaDbContext> options)
           : base(options)
        {
        }

        // DbSets
        public DbSet<SubCategory> SubCategories { get; set; }
        public DbSet<Shipping> Shippings { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Cart> Carts { get; set; }
        

        public DbSet<Address> Addresses { get; set; }
        public DbSet<Wishlist> Wishlist { get; set; }
        public DbSet<WishlistItem> WishlistItems { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<ProductTag> ProductTags { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // TPH (Table Per Hierarchy) for ApplicationUser and derived types
            modelBuilder.Entity<ApplicationUser>()
                .HasDiscriminator<string>("Role")
                .HasValue<Customer>("Customer")
                .HasValue<Seller>("Seller")
                .HasValue<Admin>("Admin");

            //// Customer - Address (One to Many)
            //modelBuilder.Entity<Address>()
            //   .HasOne(a => a.User)
            //   .WithMany(u => u.Addresses)
            //   .HasForeignKey(a => a.UserId)
            //   .OnDelete(DeleteBehavior.Cascade);

            // Seller - Product (One to Many)
            modelBuilder.Entity<Seller>()
                .HasMany(s => s.Products)
                .WithOne(p => p.Seller)
                .HasForeignKey(p => p.SellerId);

            // Product - Rating (One to Many)
            modelBuilder.Entity<Product>()
                .HasMany(p => p.Ratings)
                .WithOne(r => r.Product)
                .HasForeignKey(r => r.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // User - Rating (One to Many)
            modelBuilder.Entity<ApplicationUser>()
                .HasMany(u => u.Ratings)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Order - OrderItem (One to Many)
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId);

            // Product - OrderItem (One to Many)
            modelBuilder.Entity<Product>()
                .HasMany(p => p.OrderItems)
                .WithOne(oi => oi.Product)
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Order - Shipping (One to One)
            modelBuilder.Entity<Order>()
                .HasOne(o => o.ShippingInfo)
                .WithOne(s => s.Order)
                .HasForeignKey<Shipping>(s => s.OrderId);

            // Order - Payment (One to One)
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Payment)
                .WithOne(p => p.Order)
                .HasForeignKey<Payment>(p => p.OrderId);

            // Category - Product (One to Many)
            modelBuilder.Entity<Category>()
           .HasMany(c => c.SubCategories)
           .WithOne(s => s.Category)
           .HasForeignKey(s => s.CatId)
           .OnDelete(DeleteBehavior.Cascade);
            // SubCategory - Product (One to Many)
            modelBuilder.Entity<SubCategory>()
                .HasMany(s => s.Products)
                .WithOne(p => p.SubCategory)
                .HasForeignKey(p => p.SubCategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cart - CartItem (One to Many)
            modelBuilder.Entity<Cart>()
                .HasMany(c => c.CartItems)
                .WithOne(ci => ci.Cart)
                .HasForeignKey(ci => ci.CartId);

            // CartItem - Product (Many to One)
            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Product)
                .WithMany(p => p.CartItems)
                .HasForeignKey(ci => ci.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Customer - Cart (One to One)
            modelBuilder.Entity<Customer>()
                .HasOne(c => c.Cart)
                .WithOne(c => c.Customer)
                .HasForeignKey<Cart>(c => c.CustomerId);

            // Wishlist - WishlistItem (One to Many)
            modelBuilder.Entity<Wishlist>()
                .HasMany(w => w.WishlistItems)
                .WithOne(wi => wi.Wishlist)
                .HasForeignKey(wi => wi.WishlistId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.SubTotal)
                .HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<Product>()
                .Property(p => p.Discount)
                .HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<Product>()
                .Property(p => p.Weight)
                .HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<Rating>()
                .Property(r => r.Stars)
                .HasColumnType("decimal(18, 2)");
        }
    }
}
