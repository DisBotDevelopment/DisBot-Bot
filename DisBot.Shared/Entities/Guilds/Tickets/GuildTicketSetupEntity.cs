using System.ComponentModel.DataAnnotations;
using NetCord;
using Shared.Entities.Guilds.MessageTemplates;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Tickets;

public class GuildTicketSetupEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public ChannelType ChannelType { get; set; }
    public ulong CategoryId { get; set; }
    public string CustomId { get; set; }
    public string? TicketChannelName { get; set; }
    public string? EnableTicketsOnlyFromTime { get; set; }
    public string? MessageTemplateId { get; set; }
    public string[] TicketBlacklistRoles { get; set; } = [];
    public string? TranscriptChannelId { get; set; }
    public bool HasModal { get; set; }
    public string? ModalTitle { get; set; }
    public bool OnlyClaimMode { get; set; } = false;
    public int? TicketLimit { get; set; } = 0;
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
    public string? SlashCommandDescription { get; set; } = "Open a Ticket";
    public string? TextCommandName { get; set; }
    public bool SendTranscriptToUser { get; set; }
    public string[] TicketSettings { get; set; } = [];

    public GuildMessageTemplateEntity? UserDmWhenCloseMessageTemplateId { get; set; }
    public GuildMessageTemplateEntity? AutoReplyMessageTemplateId { get; set; }
    public GuildMessageTemplateEntity? TicketStatusMessageTemplateId { get; set; }
    public GuildMessageTemplateEntity? TicketStatusMessageId { get; set; }

    public List<GuildTicketModalDataEntity> TicketModalData { get; set; } = [];
    public List<GuildTicketPermissionEntity> TicketPermissions { get; set; } = [];
    public List<GuildTicketEntity> Tickets { get; set; } = [];
    [Required] public GuildEntity Guild { get; set; }
}