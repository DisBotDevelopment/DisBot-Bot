using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Enums.Security;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Security;

public class GuildVerificationGateEntity : IActionTimestamps
{
    public int Id { get; set; }
    public ulong? ChannelId { get; set; }
    public ulong? MessageId { get; set; }
    public VerificationActionType? Action { get; set; }
    public VerificationType? VerificationType { get; set; }
    public ulong[] VerifiedUsers { get; set; } = [];
    public bool Active { get; set; }
    public ulong[] RoleIds { get; set; } = [];

    public List<GuildVerificationGatesPermissionEntity> ChannelPermissions = [];
    [Required] public GuildSecurityEntity Security { get; set; }
}