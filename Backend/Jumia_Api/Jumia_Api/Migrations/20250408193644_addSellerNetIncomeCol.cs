using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jumia_Api.Migrations
{
    /// <inheritdoc />
    public partial class addSellerNetIncomeCol : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "SellerNetIncome",
                table: "AspNetUsers",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SellerNetIncome",
                table: "AspNetUsers");
        }
    }
}
