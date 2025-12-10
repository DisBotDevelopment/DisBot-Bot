using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Shared.Entities.Guilds.MessageTemplates;

namespace Shared.Entities.Guilds.Moderation.ModerationScout;

public class GuildModerationScoutEntity
{
    // For the scout there can be one missing table.
    public int Id { get; set; }

    public string PublicBanListUrl { get; set; } = "https://api.disbot.app/v2/banList";
    [Column(TypeName = "jsonb")] public string? AdminBanList { get; set; } // JSON Storage for custom Ban Lists
    public bool IsPublicBanListEnabled { get; set; } = false;
    public bool MustModeratorApprovePublicBan { get; set; } = false;
    public ulong[] ModeratorRoleIds { get; set; } = [];
    public ulong? ReportCommandId { get; set; }
    public ulong? ReportMessageContextId { get; set; }
    public ulong? ReportUserContextId { get; set; }
    public ulong[] ImmuneReportRoleIds { get; set; } = [];
    public ulong[] NotAllowedToReportRoleIds { get; set; } = [];
    public GuildMessageTemplateEntity? SuccessReportMessageId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public List<GuildModerationScoutReportEntity> ModerationScoutReports { get; set; } = [];
    public List<GuildModerationScoutFormEntity> ModerationScoutForms { get; set; } = [];
    
    public List<GuildModerationScoutCaseEntity> ModerationScoutCases { get; set; } = [];
    public List<GuildUserModerationEntity> UserModeration { get; set; } = [];
    public List<GuildModerationScoutUserAppealEntity> ModerationScoutUserAppeals { get; set; } = [];

    [Required] public GuildModerationEntity Moderation { get; set; }
}