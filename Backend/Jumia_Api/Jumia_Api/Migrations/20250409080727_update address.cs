using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jumia_Api.Migrations
{
    /// <inheritdoc />
    public partial class updateaddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Address_AspNetUsers_ApplicationUserId",
                table: "Address");

            migrationBuilder.DropIndex(
                name: "IX_Address_ApplicationUserId",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "Address");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "Address",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Address_ApplicationUserId",
                table: "Address",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Address_AspNetUsers_ApplicationUserId",
                table: "Address",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
