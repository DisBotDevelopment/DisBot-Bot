using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Entities.Guilds.MessageTemplates;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.TempVoice;

public class GuildTempVoiceSettingsEntity : IActionTimestamps
{
    public int Id { get; set; }

    public GuildMessageTemplateEntity? UserInviteMessageTemplate { get; set; }
    public ulong[] ModeratorUserIds { get; set; } = [];
    public ulong? TempVoiceLogChannelId { get; set; }

    public List<GuildTempVoiceConfigEntity> TempVoiceConfigs { get; } = [];
    public List<GuildTempVoicePresetEntity> TempVoicePreset { get; } = [];

    public int GuildId { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}