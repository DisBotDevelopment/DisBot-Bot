using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Automation;

public class GuildAutoReactEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public ulong ChannelId { get; set; }
    [Required] public string Emoji { get; set; }
    
    public int GuildId { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}