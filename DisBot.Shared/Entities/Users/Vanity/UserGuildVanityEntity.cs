using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Users.Vanity;

public class UserGuildVanityEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public string Slug { get; set; }
    [Required] public string Host { get; set; }
    [Required] public string Invite { get; set; }
    public bool InDiscovery { get; set; }
    public bool IsBannedFromDiscover { get; set; }

    public UserGuildVanityAnalyticsEntity? VanityAnalytic { get; set; }
    public UserGuildVanityEmbedEntity? VanityEmbed { get; set; }
    
    [Required] public UserEntity User { get; set; }
}