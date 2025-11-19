using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Users.Vanity;

public class UserGuildVanityEmbedEntity
{
    public int Id { get; set; }
    [Required] public string Title { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public string? ImageUrl { get; set; }
    public string? ThumbnailUrl { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public UserGuildVanityEmbedAuthorEntity? VanityEmbedAuthor { get; set; }
    [Required] public UserGuildVanityEntity UserGuildVanity { get; set; }
}