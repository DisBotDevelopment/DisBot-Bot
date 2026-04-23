using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DisBot.Shared.Enums.Moderation;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Moderation.ModerationScout;

public class GuildModerationScoutReportEntity : IActionTimestamps
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
    
    public List<GuildModerationScoutCaseEntity> ModerationScoutCases { get; set; } = [];
    [Required] public GuildModerationScoutEntity ModerationScout { get; set; }
}