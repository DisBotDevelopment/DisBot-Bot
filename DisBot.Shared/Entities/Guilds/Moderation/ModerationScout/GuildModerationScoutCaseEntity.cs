using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities.Guilds.Moderation.ModerationScout;

public class GuildModerationScoutCaseEntity
{
    public int Id { get; set; }
    [Required] public ulong UserId { get; set; }
    [Required] public ulong ModeratorId { get; set; }
    public int Type { get; set; }
    public ulong MessageId { get; set; }
    public ulong ChannelId { get; set; }
    [Column(TypeName = "jsonb")] public string Data { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    
    public GuildModerationScoutReportEntity? ModerationScoutReport { get; set; }
    public List<GuildUserModerationEntity> UserModeration { get; set; } = [];
    public GuildModerationScoutUserAppealEntity? ModerationScoutUserAppeal { get; set; }
    [Required] public GuildModerationScoutEntity ModerationScout { get; set; }
}