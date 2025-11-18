using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Security;

public class VerificationGatesPermission
{
    public int Id { get; set; }
    public List<string>? Permission { get; set; }
    public ulong? ChannelId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public required VerificationGates VerificationGate { get; set; }
}