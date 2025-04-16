using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jumia_Api.Migrations
{
    /// <inheritdoc />
    public partial class dropSellerId1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
               name: "FK_Order_AspNetUsers_SellerId1",
               table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Order_SellerId1",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "SellerId1",
                table: "Order");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
