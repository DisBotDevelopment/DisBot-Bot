using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Automation;

public class GuildAutoReactEntity
{
    public int Id { get; set; }
    [Required] public ulong ChannelId { get; set; }
    [Required] public string Emoji { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    
    [Required] public GuildEntity Guild { get; set; }
}