using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Entities.Guilds.MessageTemplates;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Users.Vanity;

public class UserGuildVanityAnalyticsEntity : IActionTimestamps
{
    public int Id { get; set; }
    public int? Clicks { get; set; }
    public bool TrackInviteWithLog { get; set; }
    public int UniqueClicks { get; set; } = 0;
    public int JoinedWithCode { get; set; } = 0;
    public string[]? LoggedIps { get; set; }

    public GuildMessageTemplateEntity? TrackMessageTemplate { get; set; }
    public UserGuildVanityAnalyticsLatest30DayEntity? VanityAnalyticsLatest30Day { get; set; }

    public int GuildVanityId { get; set; }
    [Required] public UserGuildVanityEntity GuildVanity { get; set; }
}