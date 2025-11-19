using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities.Guilds.Logging;

public class GuildLoggingEntity
{
    public int Id { get; set; }
    public bool IsLoggingEnabled { get; set; } = false;
    public string? AutoModWebhookUrl { get; set; }
    public string? ChannelWebhookUrl { get; set; }
    public string? EmojiWebhookUrl { get; set; }
    public string? GuildWebhookUrl { get; set; }
    public string? IntegrationWebhookUrl { get; set; }
    public string? InviteWebhookUrl { get; set; }
    public string? MemberWebhookUrl { get; set; }
    public string? MessageWebhookUrl { get; set; }
    public string? ModerationWebhookUrl { get; set; }
    public string? ReactionWebhookUrl { get; set; }
    public string? RoleWebhookUrl { get; set; }
    public string? SoundBoardWebhookUrl { get; set; }
    public string? StickerWebhookUrl { get; set; }
    public string? ThreadWebhookUrl { get; set; }
    public string? VoiceWebhookUrl { get; set; }
    public string? WebhookWebhookUrl { get; set; }
    public string? BanWebhookUrl { get; set; }
    public string? KickWebhookUrl { get; set; }
    public string? PollWebhookUrl { get; set; }
    public string? StageWebhookUrl { get; set; }
    public string? EventWebhookUrl { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildEntity Guild { get; set; }
}