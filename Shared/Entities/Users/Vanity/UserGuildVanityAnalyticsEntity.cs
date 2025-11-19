using System.ComponentModel.DataAnnotations;
using Shared.Entities.Guilds.MessageTemplates;

namespace Shared.Entities.Users.Vanity;

public class UserGuildVanityAnalyticsEntity
{
    public int Id { get; set; }
    public int? Clicks { get; set; }
    public bool TrackInviteWithLog { get; set; }
    public int UniqueClicks { get; set; } = 0;
    public int JoinedWithCode { get; set; } = 0;
    public string[]? LoggedIps { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public GuildMessageTemplateEntity? TrackMessageTemplate { get; set; }
    public UserGuildVanityAnalyticsLatest30DayEntity? VanityAnalyticsLatest30Day { get; set; }
    [Required] public UserGuildVanityEntity UserGuildVanity { get; set; }
}