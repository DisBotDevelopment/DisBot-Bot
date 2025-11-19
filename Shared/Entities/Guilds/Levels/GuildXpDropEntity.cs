using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Levels;

public class GuildXpDropEntity
{
    public int Id { get; set; }
    public string? XpRange { get; set; }
    public int TimeToRespawn { get; set; }
    public ulong[] ChannelIds { get; set; } = [];
    public int ClaimAmount { get; set; }
    public int ExpireTime { get; set; }
    public DateTimeOffset LastSpawned { get; set; }
    public ulong[] MessageIdsToDelete { get; set; } = [];
    [Required] public GuildLevelSettingsEntity GuildLevelSettings { get; set; }
}