using Jumia.Data;
using Jumia.Models;
using Jumia_Api.Models;
using Jumia_Api.Repository;
namespace Jumia_Api.UnitOFWorks
{
    public class UnitOFWork
    {
        JumiaDbContext db;
        ProductsRepository productsRepository;
        CategoryRepository categoryRepository;
        GenericRepository<Cart> cartRepository;
        SubCategoryRepository subCategoryRepository;
        GenericRepository<Order> orderRepository;
        GenericRepository<OrderItem> orderItemRepository;
        GenericRepository<Payment> paymentRepository;
        GenericRepository<Shipping> shippingRepository;
        GenericRepository<ProductImage> productImageRepository;
        SellerRepository sellerRepository;
        public UnitOFWork(JumiaDbContext context)
        {
            db = context;
        }
        public ProductsRepository ProductsRepository
        {
            get
            {
                if (productsRepository == null)
                {
                    productsRepository = new ProductsRepository(db);
                }
                return productsRepository;
            }
        }
        public CategoryRepository CategoryRepository
        {
            get
            {
                if (categoryRepository == null)
                {
                    categoryRepository = new CategoryRepository(db);
                }
                return categoryRepository;
            }
        }
        public GenericRepository<Cart> CartRepository
        {
            get
            {
                if (cartRepository == null)
                {
                    cartRepository = new GenericRepository<Cart>(db);
                }
                return cartRepository;
            }
        }
        public SubCategoryRepository SubCategoryRepository
        {
            get
            {
                if (subCategoryRepository == null)
                {
                    subCategoryRepository = new SubCategoryRepository(db);
                }
                return subCategoryRepository;
            }
        }

        public GenericRepository<Order> OrderRepository
        {
            get
            {
                if (orderRepository == null)
                {
                    orderRepository = new GenericRepository<Order>(db);
                }
                return orderRepository;
            }
        }

        public GenericRepository<OrderItem> OrderItemRepository
        {
            get
            {
                if(orderItemRepository == null)
                {
                    orderItemRepository = new GenericRepository<OrderItem>(db);
                }
                return orderItemRepository;
            }
        }

        public GenericRepository<Payment> PaymentRepository
        {
            get
            {
                if(paymentRepository == null)
                {
                    paymentRepository = new GenericRepository<Payment>(db);
                }
                return paymentRepository;
            }
        }

        public GenericRepository<Shipping> ShippingRepository
        {
            get
            {
                if(shippingRepository == null)
                {
                    shippingRepository = new GenericRepository<Shipping>(db);
                }
                return shippingRepository;
            }
        }

        public GenericRepository<ProductImage> ProductImgRepository
        {
            get
            {
                if(productImageRepository == null)
                {
                    productImageRepository = new GenericRepository<ProductImage>(db);
                }
                return productImageRepository;
            }
        }
        public SellerRepository SellerRepository
        {
            get
            {
                if (sellerRepository == null)
                {
                    sellerRepository = new SellerRepository(db);
                }
                return sellerRepository;
            }
        }
        public void Save()
        {
            db.SaveChanges();
        }
    }
}
