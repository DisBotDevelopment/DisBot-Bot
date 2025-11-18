using NetCord;

namespace Shared.Entities.Guilds.Tickets;

public class Tickets
{
    public int Id { get; set; }
    public bool IsClosed { get; set; }
    public required ChannelType ChannelType { get; set; }
    public ulong? ChannelId { get; set; }
    public ulong? ThreadId { get; set; }
    public ulong? LastMessageId { get; set; }
    public bool IsClaimed { get; set; }
    public bool IsArchived { get; set; }
    public ulong? ArchiveMessageId { get; set; }
    public ulong? UserWhoHasClaimedId { get; set; }
    public bool IsLocked { get; set; }
    public ulong? TicketOwnerId { get; set; }
    public ulong[]? AddedMemberIds { get; set; }
    public ulong TranscriptChannelId { get; set; }
    public string? TranscriptHtml { get; set; }
    public string? TranscriptJson { get; set; }
    public string[]? TicketNotes { get; set; }
    public bool? SendTranscriptToUser { get; set; }
    public bool IsAutoDone { get; set; }
    public ulong? OldTicketCategoryId { get; set; }
    public string[]? AutoCloseAction { get; set; }
    public string? CloseActionReason { get; set; }
    public MessageTemplates.MessageTemplates? AutoReplyMessageTemplateId { get; set; }
    public bool AutoAssignHandler { get; set; }
    public ulong? TicketFeedbackChannelId { get; set; }
    public bool WithTicketFeedback { get; set; }
    public MessageTemplates.MessageTemplates? UserDmWhenCloseMessageTemplateId { get; set; }
    public bool OnlyClaimMode { get; set; }

    public DateTimeOffset ClosedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public TicketFeedback? TicketFeedback { get; set; }
    public required TicketSetups TicketSetup { get; set; }
}