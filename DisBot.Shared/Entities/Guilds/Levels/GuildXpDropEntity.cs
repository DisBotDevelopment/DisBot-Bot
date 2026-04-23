using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Levels;

public class GuildXpDropEntity : IActionTimestamps
{
    public int Id { get; set; }
    public string? XpRange { get; set; }
    public int TimeToRespawn { get; set; }
    public ulong[] ChannelIds { get; set; } = [];
    public int ClaimAmount { get; set; }
    public int ExpireTime { get; set; }
    public ulong[] MessageIdsToDelete { get; set; } = [];

    public DateTimeOffset LastSpawned { get; set; }
    [Required] public GuildLevelSettingsEntity LevelSettings { get; set; }
}