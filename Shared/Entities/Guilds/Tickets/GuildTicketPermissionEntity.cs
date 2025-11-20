using System.ComponentModel.DataAnnotations;
using NetCord;

namespace Shared.Entities.Guilds.Tickets;

public class GuildTicketPermissionEntity
{
    public int Id { get; set; }
    public ulong? DiscordUserId { get; set; }
    public ulong? DiscordRoleId { get; set; }
    public bool HasShadowPing { get; set; } = false;
    public bool IsHandler { get; set; } = false;
    public string[]? Permissions { get; set; }
    public ulong? AllowedDiscordPermissions { get; set; }
    public ulong? DeniedDiscordPermissions { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildTicketSetupEntity TicketSetup { get; set; }
}