using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Users.Vanity;

public class UserGuildVanityEmbedAuthorEntity
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Url { get; set; }
    public string? IconUrl { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public UserGuildVanityEmbedEntity GuildVanityEmbed { get; set; }
}