using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DisBot.API.Database.Migrations
{
    /// <inheritdoc />
    public partial class changedGuildOwnertoUserEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GuildOwner",
                table: "Guilds");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Guilds",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Guilds_UserId",
                table: "Guilds",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Guilds_Users_UserId",
                table: "Guilds",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Guilds_Users_UserId",
                table: "Guilds");

            migrationBuilder.DropIndex(
                name: "IX_Guilds_UserId",
                table: "Guilds");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Guilds");

            migrationBuilder.AddColumn<string>(
                name: "GuildOwner",
                table: "Guilds",
                type: "text",
                nullable: true);
        }
    }
}
