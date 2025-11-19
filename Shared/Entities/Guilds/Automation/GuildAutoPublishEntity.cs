using System.ComponentModel.DataAnnotations;
using NetCord.Gateway;

namespace Shared.Entities.Guilds.Automation;

public class GuildAutoPublishEntity
{
    public int Id { get; set; }
    public ulong[] ChannelIds { get; set; } = [];
    [Required] public Guild Guild { get; set; }
}