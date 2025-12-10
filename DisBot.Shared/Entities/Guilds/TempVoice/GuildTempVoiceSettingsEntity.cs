using System.ComponentModel.DataAnnotations;
using Shared.Entities.Guilds.MessageTemplates;

namespace Shared.Entities.Guilds.TempVoice;

public class GuildTempVoiceSettingsEntity
{
    public int Id { get; set; }

    public GuildMessageTemplateEntity? UserInviteMessageTemplate { get; set; }
    public ulong[] ModeratorUserIds { get; set; } = [];
    public ulong? TempVoiceLogChannelId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public List<GuildTempVoiceConfigEntity> TempVoiceConfigs { get; } = [];
    public List<GuildTempVoicePresetEntity> TempVoicePreset { get; } = [];
    [Required] public GuildEntity Guild { get; set; }
}