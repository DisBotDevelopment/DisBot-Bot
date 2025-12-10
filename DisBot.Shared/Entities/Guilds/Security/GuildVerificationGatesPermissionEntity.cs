using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Security;

public class GuildVerificationGatesPermissionEntity
{
    public int Id { get; set; }
    [Required] public ulong ChannelId { get; set; }
    [Required] public string[] Permissions { get; set; }


    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildVerificationGateEntity VerificationGate { get; set; }
}