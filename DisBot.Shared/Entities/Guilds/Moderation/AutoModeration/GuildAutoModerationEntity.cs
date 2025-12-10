using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Shared.Enums.Moderation;

namespace Shared.Entities.Guilds.Moderation.AutoModeration;

public class GuildAutoModerationEntity
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

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildModerationEntity Moderation { get; set; }
}