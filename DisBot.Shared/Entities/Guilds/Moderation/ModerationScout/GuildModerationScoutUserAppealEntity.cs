using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Moderation.ModerationScout;

public class GuildModerationScoutUserAppealEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public string AppealToken { get; set; } // Public Id
    [Required] public ulong UserId { get; set; }
    [Column(TypeName = "jsonb")] public string? Data { get; set; }
    [Required] public ulong CreatedBy { get; set; }

    [Required] public GuildModerationScoutFormEntity LinkedModerationScoutForm { get; set; }
    public int ModerationScoutCaseId { get; set; }
    [Required] public GuildModerationScoutCaseEntity ModerationScoutCase { get; set; }
    [Required] public GuildModerationScoutEntity ModerationScout { get; set; }
}