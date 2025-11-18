using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Security;

public class GuildSecurity
{
    [Key] public int Id { get; set; }
    public string? InviteLoggingActive { get; set; }
    public int? MaxAccountAge { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public ICollection<VerificationGates> VerificationGates { get; set; } = new List<VerificationGates>();
    public required Guild Guild { get; set; }
}