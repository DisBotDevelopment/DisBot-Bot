namespace Shared.Entities.Guilds.TempVoice;

public class TempVoice
{
    public int Id { get; set; }

    public string? UserInviteMessageTemplateId { get; set; }
    public string[] ModeratorUserIds { get; set; } = [];
    public string? TempVoiceLogChannelId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public ICollection<TempVoiceConfig> TempVoiceConfigs { get; } = new List<TempVoiceConfig>();
    public ICollection<TempVoicePreset> TempVoicePreset { get; } = new List<TempVoicePreset>();
    public required Guild Guild { get; set; }
}