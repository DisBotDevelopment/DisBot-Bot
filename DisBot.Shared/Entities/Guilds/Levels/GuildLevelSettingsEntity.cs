using System.ComponentModel.DataAnnotations;
using Shared.Enums.Levels;

namespace Shared.Entities.Guilds.Levels;

public class GuildLevelSettingsEntity
{
    public int Id { get; set; }
    public ulong LevelUpChannelId { get; set; }
    public int LeaderboardDisplayAmount { get; set; } = 10;
    public int? RequiredXpForFirstLevel { get; set; } = 1000;
    public string? MessageXpRange { get; set; } = "0-10";
    public string? VoiceXpRange { get; set; } = "10-15";
    public int VoiceXpCooldown { get; set; } = 900000;
    public ulong[]? ExcludedChannelIds { get; set; } = [];
    public ulong[]? ExcludeUserIds { get; set; } = [];
    public ulong[]? ExcludeRoleIds { get; set; } = [];
    public bool IsLevelModuleEnabled { get; set; } = false;
    public bool IsMessageXpEnabled { get; set; } = false;
    public bool IsVoiceXpEnabled { get; set; } = false;
    public int? MessageXpCooldown { get; set; } = 900000;
    public MessageXpType[] MessageXpType { get; set; } = [Enums.Levels.MessageXpType.Cooldown];
    public string? RequiredXpFormular { get; set; }
    public LevelMessageType? LevelUpMessageType { get; set; }

    public LevelMessageType? XpStreaksMessageType { get; set; } = LevelMessageType.Channel;
    public ulong? XpStreaksMessageChannelId { get; set; }
    public XpStreaksIncreaseType[]? XpStreaksIncreaseType { get; set; } = [];

    public MessageTemplates.GuildMessageTemplateEntity? LeaderboardMessageTemplate { get; set; }
    public MessageTemplates.GuildMessageTemplateEntity? LevelUpMessageTemplate { get; set; }
    public MessageTemplates.GuildMessageTemplateEntity? LevelUserInfoMessageTemplate { get; set; }
    public MessageTemplates.GuildMessageTemplateEntity? XpDropsMessageTemplate { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public List<GuildLevelRoleEntity> LevelRoles = [];
    public List<Levels.GuildLevelEntity> Levels = [];
    public List<GuildXpDropEntity> XpDrops = [];
    public List<GuildXpStreakEntity> XpStreaks = [];
    [Required] public GuildEntity Guild { get; set; }
}