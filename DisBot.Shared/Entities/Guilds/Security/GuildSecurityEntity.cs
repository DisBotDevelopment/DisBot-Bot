using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Security;

public class GuildSecurityEntity : IActionTimestamps
{
    public int Id { get; set; }
    public bool? InviteLoggingActive { get; set; } = false;
    public int? MaxAccountAge { get; set; } = null;

    public List<GuildVerificationGateEntity> VerificationGates { get; set; } = [];

    public int GuildId { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}