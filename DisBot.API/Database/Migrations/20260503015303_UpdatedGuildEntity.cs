using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DisBot.API.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedGuildEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GuildName",
                table: "Guilds",
                newName: "DiscordGuildName");

            migrationBuilder.RenameColumn(
                name: "GuildId",
                table: "Guilds",
                newName: "DiscordGuildId");

            migrationBuilder.AddColumn<string>(
                name: "DiscordGuildAvatar",
                table: "Guilds",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscordGuildAvatar",
                table: "Guilds");

            migrationBuilder.RenameColumn(
                name: "DiscordGuildName",
                table: "Guilds",
                newName: "GuildName");

            migrationBuilder.RenameColumn(
                name: "DiscordGuildId",
                table: "Guilds",
                newName: "GuildId");
        }
    }
}
