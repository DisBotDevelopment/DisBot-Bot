using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Users.Vanity;

public class UserGuildVanityEmbedAuthorEntity : IActionTimestamps
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Url { get; set; }
    public string? IconUrl { get; set; }

    public int GuildVanityEmbedId { get; set; }
    [Required] public UserGuildVanityEmbedEntity GuildVanityEmbed { get; set; }
}