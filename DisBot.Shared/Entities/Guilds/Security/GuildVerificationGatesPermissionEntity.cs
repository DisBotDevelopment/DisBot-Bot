using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Security;

public class GuildVerificationGatesPermissionEntity :IActionTimestamps
{
    public int Id { get; set; }
    [Required] public ulong ChannelId { get; set; }
    [Required] public string[] Permissions { get; set; }
    
    [Required] public GuildVerificationGateEntity VerificationGate { get; set; }
}