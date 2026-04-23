using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.DiscordUtility;

public class GuildDiscordGuildAddonEntity : IActionTimestamps
{
    public int Id { get; set; }

    public string[]? OnlyMedia { get; set; }
    public string[]? NoLinkEmbeds { get; set; }
    public bool InvitesPaused { get; set; } = false;

    public int GuildId { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}