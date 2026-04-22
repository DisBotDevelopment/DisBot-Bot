using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Automation;

public class GuildAutoPublishEntity : IActionTimestamps
{
    public int Id { get; set; }
    public ulong[] ChannelIds { get; set; } = [];

    public int GuildId { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}