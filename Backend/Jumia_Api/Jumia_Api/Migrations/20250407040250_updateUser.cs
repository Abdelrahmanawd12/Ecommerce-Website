using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jumia_Api.Migrations
{
    /// <inheritdoc />
    public partial class updateUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdminId",
                table: "Address",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SellerId",
                table: "Address",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Address_AdminId",
                table: "Address",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_Address_SellerId",
                table: "Address",
                column: "SellerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Address_AspNetUsers_AdminId",
                table: "Address",
                column: "AdminId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Address_AspNetUsers_SellerId",
                table: "Address",
                column: "SellerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Address_AspNetUsers_AdminId",
                table: "Address");

            migrationBuilder.DropForeignKey(
                name: "FK_Address_AspNetUsers_SellerId",
                table: "Address");

            migrationBuilder.DropIndex(
                name: "IX_Address_AdminId",
                table: "Address");

            migrationBuilder.DropIndex(
                name: "IX_Address_SellerId",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "AdminId",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "SellerId",
                table: "Address");
        }
    }
}
