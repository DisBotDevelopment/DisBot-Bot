using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DisBot.API.Database.Migrations
{
    /// <inheritdoc />
    public partial class RemovedfromGuildEntitybypropertyUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Guilds_Users_UserId",
                table: "Guilds");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Guilds",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Guilds_Users_UserId",
                table: "Guilds",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Guilds_Users_UserId",
                table: "Guilds");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Guilds",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Guilds_Users_UserId",
                table: "Guilds",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
