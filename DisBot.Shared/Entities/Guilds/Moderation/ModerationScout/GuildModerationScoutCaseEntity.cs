using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Moderation.ModerationScout;

public class GuildModerationScoutCaseEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public ulong UserId { get; set; }
    [Required] public ulong ModeratorId { get; set; }
    public int Type { get; set; }
    public ulong MessageId { get; set; }
    public ulong ChannelId { get; set; }
    [Column(TypeName = "jsonb")] public string Data { get; set; }
    
    public GuildModerationScoutReportEntity? ModerationScoutReport { get; set; }
    public List<GuildUserModerationEntity> UserModeration { get; set; } = [];
    public GuildModerationScoutUserAppealEntity? ModerationScoutUserAppeal { get; set; }
    
    [Required] public GuildModerationScoutEntity ModerationScout { get; set; }
}