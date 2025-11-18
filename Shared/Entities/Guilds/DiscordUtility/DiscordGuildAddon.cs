namespace Shared.Entities.Guilds.DiscordUtility;

public class DiscordGuildAddon
{
    public int Id { get; set; }

    public string[]? OnlyMedia { get; set; }
    public string[]? NoLinkEmbeds { get; set; }
    public bool InvitesPaused { get; set; } = false;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public required Guild Guild { get; set; }
}