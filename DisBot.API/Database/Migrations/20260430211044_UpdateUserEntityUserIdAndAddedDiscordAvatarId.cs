using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DisBot.API.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserEntityUserIdAndAddedDiscordAvatarId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Users",
                newName: "DiscordUserId");

            migrationBuilder.AddColumn<string>(
                name: "DiscordAvatarId",
                table: "Users",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscordAvatarId",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "DiscordUserId",
                table: "Users",
                newName: "UserId");
        }
    }
}
