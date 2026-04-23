using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DisBot.Shared.Enums.Moderation;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Moderation.AutoModeration;

public class GuildAutoModerationEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public AutoModerationType Type { get; set; }
    public string? RegexPattern { get; set; }
    public ulong ExcludedChannelIds { get; set; }
    public ulong ExcludedRoleIds { get; set; }
    [Column(TypeName = "jsonb")]
    public string Actions { get; set; }
    [Column(TypeName = "jsonb")]
    public string Triggers { get; set; }
    
    [Required] public GuildModerationEntity Moderation { get; set; }
}