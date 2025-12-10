using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities.Guilds.Moderation.ModerationScout;

public class GuildModerationScoutUserAppealEntity
{
    public int Id { get; set; }
    [Required] public string AppealToken { get; set; } // Public Id
    [Required] public ulong UserId { get; set; }
    [Column(TypeName = "jsonb")] public string? Data { get; set; }
    [Required] public ulong CreatedBy { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildModerationScoutFormEntity LinkedModerationScoutForm { get; set; }
    [Required] public GuildModerationScoutCaseEntity ModerationScoutCase { get; set; }
    [Required] public GuildModerationScoutEntity ModerationScout { get; set; }
}