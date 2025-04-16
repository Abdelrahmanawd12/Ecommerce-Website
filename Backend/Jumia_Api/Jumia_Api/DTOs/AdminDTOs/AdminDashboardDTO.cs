namespace Jumia_Api.DTOs.AdminDTOs
{
    public class AdminDashboardDTO
    {
        public int TotalUsers { get; set; }
        public int TotalCategories { get; set; }
        public int TotalSubCategories { get; set; }
        public int TotalProducts { get; set; }
        public int OutOfStockProducts { get; set; }
        public int NewUsersThisMonth { get; set; }
        public decimal TotalSales { get; set; }
        public decimal TotalCommission { get; set; }
    }


}
