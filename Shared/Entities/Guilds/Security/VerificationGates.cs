using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities.Guilds.Security;

public class VerificationGates
{
    public int Id { get; set; }
    [Key] [Column("UUID")] public required Guid Uuid { get; set; }
    public ulong? ChannelId { get; set; }
    public ulong? MessageId { get; set; }
    public string? Action { get; set; }
    public string? ActionType { get; set; }
    public ulong[] Roles { get; set; } = [];
    public List<ulong> VerifiedUsers { get; set; } = [];
    public bool Active { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public ICollection<VerificationGatesPermission> ChannelPermissions = [];
    public required GuildSecurity GuildSecurity { get; set; }
}