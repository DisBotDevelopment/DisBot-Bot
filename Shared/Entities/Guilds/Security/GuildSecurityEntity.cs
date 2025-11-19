using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Security;

public class GuildSecurityEntity
{
    public int Id { get; set; }
    public bool? InviteLoggingActive { get; set; } = false;
    public int? MaxAccountAge { get; set; } = null;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public List<GuildVerificationGateEntity> VerificationGates { get; set; } = [];
    [Required] public GuildEntity Guild { get; set; }
}