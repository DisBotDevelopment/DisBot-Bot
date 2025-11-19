using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Shared.Entities.Guilds.MessageTemplates;

namespace Shared.Entities.Guilds.Giveaways;

public class GuildGiveawayEntity
{
    public int Id { get; set; }
    public ulong? MessageId { get; set; }
    public ulong? ChannelId { get; set; }
    public string? Prize { get; set; }
    public int Winners { get; set; }
    public int? Time { get; set; }
    public bool IsEnded { get; set; } = false;
    public ulong? EndedBy { get; set; }
    public bool IsPaused { get; set; } = false;
    public bool IsRerolled { get; set; } = false;
    public ulong[] WinnerIds { get; set; } = [];
    public ulong? HostedBy { get; set; }
    public ulong[] Entrys { get; set; } = [];
    public string[] Requirements { get; set; } = [];

    public GuildMessageTemplateEntity? EndedMessageTemplate { get; set; }
    public GuildMessageTemplateEntity? MessageTemplate { get; set; }
    public GuildMessageTemplateEntity? WinnerMessageTemplate { get; set; }

    public DateTimeOffset EndedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildEntity Guild { get; set; }
}