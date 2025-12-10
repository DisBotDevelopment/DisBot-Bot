using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Shared.Enums.Moderation;

namespace Shared.Entities.Guilds.Moderation.ModerationScout;

public class GuildModerationScoutReportEntity
{
    // To create Moderation Scouts Cases.
    public int Id { get; set; }
    [Required] public string Name { get; set; }
    [Required] public ulong ReporterId { get; set; }
    [Required] public ulong UserId { get; set; }
    public string? Placeholder { get; set; }
    public int MinLength { get; set; }
    public int MaxLength { get; set; }
    public bool Required { get; set; }
    [Column(TypeName = "jsonb")] public string Data { get; set; }
    public ModerationScoutInteractionType InteractionType { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public List<GuildModerationScoutCaseEntity> ModerationScoutCases { get; set; } = [];
    [Required] public GuildModerationScoutEntity ModerationScout { get; set; }
}