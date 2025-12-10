using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Shared.Entities.Guilds.Moderation.ModerationScout;

namespace Shared.Entities.Guilds.Moderation;

public class GuildUserModerationEntity
{
    public int Id { get; set; }
    [Required] public string CaseId { get; set; }
    [Required] public int Type { get; set; }
    [Required] public ulong[] UserIds { get; set; } = [];
    [Required] public ulong ModeratorId { get; set; }
    public int Duration { get; set; }
    public string? Reason { get; set; }
    public string? DmMessage { get; set; }
    public string[] Notes { get; set; } = [];
    [Column(TypeName = "jsonb")] public string? CustomData { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildModerationScoutCaseEntity ModerationScoutCases { get; set; }
    [Required] public GuildModerationEntity Moderation { get; set; }
}