using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities.Guilds.Moderation.ModerationScout;

public class GuildModerationScoutFormEntity
{
    public int Id { get; set; }

    [Required] public string CustomId { get; set; }
    [Column(TypeName = "jsonb")] public string[] Actions { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public List<GuildModerationScoutUserAppealEntity> ModerationScoutUserAppeals { get; set; } = [];
    [Required] public GuildModerationScoutEntity ModerationScout { get; set; }
}