namespace Shared.Entities.Guilds.Tickets;

public class TicketPermissions
{
    public int Id { get; set; }
    public ulong? DiscordUserId { get; set; }
    public ulong? DiscordRoleId { get; set; }
    public bool HasShadowPing { get; set; }
    public bool IsHandler { get; set; }
    public string[]? Permissions { get; set; }
    public ulong? AllowedDiscordPermissions { get; set; }
    public ulong? DeniedDiscordPermissions { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public required TicketSetups TicketSetup { get; set; }
}