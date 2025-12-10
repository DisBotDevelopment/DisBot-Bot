using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Shared.Enums.Security;

namespace Shared.Entities.Guilds.Security;

public class GuildVerificationGateEntity
{
    public int Id { get; set; }
    public ulong? ChannelId { get; set; }
    public ulong? MessageId { get; set; }
    public VerificationActionType? Action { get; set; }
    public VerificationType? VerificationType { get; set; }
    public ulong[] VerifiedUsers { get; set; } = [];
    public bool Active { get; set; }
    public ulong[] RoleIds { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public List<GuildVerificationGatesPermissionEntity> ChannelPermissions = [];
    [Required] public GuildSecurityEntity Security { get; set; }
}