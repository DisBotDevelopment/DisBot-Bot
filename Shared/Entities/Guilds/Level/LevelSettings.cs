namespace Shared.Entities.Guilds.Level;

public class LevelSettings
{
    public int Id { get; set; }
    public ulong LevelUpChannelId { get; set; }
    public int LeaderboardDisplayAmount { get; set; }
    public int? RequiredXpForFirstLevel { get; set; }
    public string? MessageXpRange { get; set; }
    public string? VoiceXpRange { get; set; }
    public int VoiceXpCooldown { get; set; }
    public ulong[]? ExcludedChannelIds { get; set; }
    public ulong[]? ExcludeUserIds { get; set; }
    public ulong[]? ExcludeRoleIds { get; set; }
    public bool IsLevelModuleEnabled { get; set; }
    public bool IsMessageXpEnabled { get; set; }
    public bool IsVoiceXpEnabled { get; set; }
    public int MessageXpCooldown { get; set; }
    public string[]? MessageXpType { get; set; }
    public string? RequiredXpFormular { get; set; }
    public string? LevelUpMessageType { get; set; }

    public string? XpStreaksMessageType { get; set; }
    public ulong? XpStreaksMessageChannelId { get; set; }
    public string[]? XpStreaksIncreaseType { get; set; }

    public MessageTemplates.MessageTemplates? LeaderboardMessageTemplateId { get; set; }
    public MessageTemplates.MessageTemplates? LevelUpMessageTemplateId { get; set; }
    public MessageTemplates.MessageTemplates? LevelUserInfoMessageTemplate { get; set; }
    public MessageTemplates.MessageTemplates? XpDropsMessageTemplate { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public List<LevelRoles> LevelRoles = [];
    public List<Levels> Levels = [];
    public List<XpDrops> XpDrops = [];
    public List<XpStreaks> XpStreaks = [];
    public required Guild Guild { get; set; }
}