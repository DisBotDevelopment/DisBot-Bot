using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Users.Vanity;

public class UserGuildVanityEmbedEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public string Title { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public string? ImageUrl { get; set; }
    public string? ThumbnailUrl { get; set; }
    
    public UserGuildVanityEmbedAuthorEntity? VanityEmbedAuthor { get; set; }

    public int GuildVanityId { get; set; }
    [Required] public UserGuildVanityEntity GuildVanity { get; set; }
}