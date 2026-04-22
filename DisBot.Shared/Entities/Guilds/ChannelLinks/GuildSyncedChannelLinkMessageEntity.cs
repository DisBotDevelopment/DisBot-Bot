using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.ChannelLinks;

public class GuildSyncedChannelLinkMessageEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public ulong UserMessageId { get; set; }
    [Required] public ulong WebhookMessageId { get; set; }
    public string? WebhookUrl { get; set; }
    [Required] public ulong ChannelId { get; set; }
    
    [Required] public GuildChannelLinksEntity ChannelLinks { get; set; }
}