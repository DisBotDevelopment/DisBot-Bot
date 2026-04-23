using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Users.Vanity;

public class UserGuildVanityAnalyticsLatest30DayEntity : IActionTimestamps
{
    public int Id { get; set; }
    public int? Clicks { get; set; } = 0;
    public int? UniqueClicks { get; set; } = 0;
    public int? JoinedWithCode { get; set; } = 0;

    public int GuildVanityAnalyticsId { get; set; }
    [Required] public UserGuildVanityAnalyticsEntity GuildVanityAnalytics { get; set; }
}