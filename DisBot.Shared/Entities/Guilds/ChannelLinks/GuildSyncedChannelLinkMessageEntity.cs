using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.ChannelLinks;

public class GuildSyncedChannelLinkMessageEntity
{
    public int Id { get; set; }
    [Required] public ulong UserMessageId { get; set; }
    [Required] public ulong WebhookMessageId { get; set; }
    public string? WebhookUrl { get; set; }
    [Required] public ulong ChannelId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildChannelLinksEntity ChannelLinks { get; set; }
}