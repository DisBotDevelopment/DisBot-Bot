using NetCord;

namespace Shared.Entities.Guilds.Tickets;

public class TicketSetups
{
    public int Id { get; set; }
    public ulong CategoryId { get; set; }
    public ChannelType ChannelType { get; set; }
    public string CustomId { get; set; }
    public string? TicketChannelName { get; set; }
    public string? EnableTicketsOnlyFromTime { get; set; }
    public string? MessageTemplateId { get; set; }
    public string[] TicketBlacklistRoles { get; set; } = [];
    public string? TranscriptChannelId { get; set; }
    public bool HasModal { get; set; }
    public string? ModalTitle { get; set; }
    public bool OnlyClaimMode { get; set; }
    public int? TicketLimit { get; set; }

    public bool WithTicketFeedback { get; set; }
    public string? TicketFeedbackChannelId { get; set; }
    public int? TicketCreationCooldownPerUser { get; set; }
    public int? AutoCloseAfterInactivity { get; set; }
    public int? AutoCloseAfterTime { get; set; }
    public string? AutoAssignHandler { get; set; }

    public string? TicketRateLimit { get; set; }
    public ulong? TicketStatusChannelId { get; set; }
    public string[] AutoCloseAction { get; set; } = [];
    public string? OldTicketCategoryId { get; set; }
    public ulong[] RequiredRoles { get; set; } = [];
    public ulong? SlashCommandId { get; set; }
    public string? SlashCommandName { get; set; }
    public string? SlashCommandDescription { get; set; }
    public string? TextCommandName { get; set; }
    public bool SendTranscriptToUser { get; set; }
    public string[] TicketSettings { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public MessageTemplates.MessageTemplates? UserDmWhenCloseMessageTemplateId { get; set; }
    public MessageTemplates.MessageTemplates? AutoReplyMessageTemplateId { get; set; }
    public MessageTemplates.MessageTemplates? TicketStatusMessageTemplateId { get; set; }
    public MessageTemplates.MessageTemplates? TicketStatusMessageId { get; set; }

    public ICollection<TicketModalData> TicketModalData { get; set; } = new List<TicketModalData>();
    public ICollection<TicketPermissions> TicketPermissions { get; set; } = new List<TicketPermissions>();
    public ICollection<Tickets> Tickets { get; set; } = new List<Tickets>();
    public required Guild Guild { get; set; }
}