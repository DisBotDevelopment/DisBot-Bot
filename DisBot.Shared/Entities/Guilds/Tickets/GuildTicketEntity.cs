using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Entities.Guilds.MessageTemplates;
using DisBot.Shared.Enums.Ticket;
using DisBot.Shared.Interfaces;
using NetCord;

namespace DisBot.Shared.Entities.Guilds.Tickets;

public class GuildTicketEntity : IActionTimestamps
{
    public int Id { get; set; }
    public bool IsClosed { get; set; }
    [Required] public ChannelType ChannelType { get; set; }
    public ulong? ChannelId { get; set; }
    public ulong? ThreadId { get; set; }
    public ulong? LastCreatedMessageIdInTicket { get; set; }
    public bool IsClaimed { get; set; } = false;
    public bool IsArchived { get; set; } = false;
    public ulong? ArchiveMessageId { get; set; } = null;
    public ulong? UserWhoHasClaimedId { get; set; }
    public bool IsLocked { get; set; } = false;
    public ulong? TicketOwnerId { get; set; }
    public ulong[]? AddedMemberIds { get; set; }
    public ulong TranscriptChannelId { get; set; }
    public string? TranscriptHtml { get; set; }
    public string? TranscriptJson { get; set; }
    public string[] TicketNotes { get; set; } = [];
    public bool? SendTranscriptToUser { get; set; }
    public ulong? OldTicketCategoryId { get; set; }
    public TicketAutoCloseActionType[] AutoCloseAction { get; set; } = [];
    public string? CloseActionReason { get; set; }
    public bool AutoAssignHandler { get; set; } = false;
    public ulong? TicketFeedbackChannelId { get; set; }
    public bool WithTicketFeedback { get; set; } = false;
    public bool OnlyClaimMode { get; set; } = false;
    public bool IsAutoDone { get; set; } = false; // System Value

    public GuildMessageTemplateEntity? AutoReplyMessageTemplateId { get; set; }
    public GuildMessageTemplateEntity? UserDmWhenCloseMessageTemplateId { get; set; }

    public DateTimeOffset ClosedAt { get; set; }
    
    public GuildTicketFeedbackEntity? TicketFeedback { get; set; }
    [Required] public GuildTicketSetupEntity TicketSetup { get; set; }
}