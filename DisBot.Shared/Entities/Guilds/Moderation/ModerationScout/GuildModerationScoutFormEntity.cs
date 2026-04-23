using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Moderation.ModerationScout;

public class GuildModerationScoutFormEntity : IActionTimestamps
{
    public int Id { get; set; }

    [Required] public string CustomId { get; set; }
    [Column(TypeName = "jsonb")] public string[] Actions { get; set; } = [];

    public List<GuildModerationScoutUserAppealEntity> ModerationScoutUserAppeals { get; set; } = [];
    [Required] public GuildModerationScoutEntity ModerationScout { get; set; }
}