using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Users.Vanity;

public class UserGuildVanityAnalyticsLatest30DayEntity
{
    public int Id { get; set; }
    public int? Clicks { get; set; } = 0;
    public int? UniqueClicks { get; set; } = 0;
    public int? JoinedWithCode { get; set; } = 0;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public UserGuildVanityAnalyticsEntity UserGuildVanityAnalytics { get; set; }
}