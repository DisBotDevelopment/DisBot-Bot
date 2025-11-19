using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Shared.Entities.Guilds.MessageTemplates;

namespace Shared.Entities.Guilds.TempVoice;

public class GuildTempVoiceConfigEntity
{
    public int Id { get; set; }
    [Required] public ulong CreatorChannel { get; set; }
    [Required] public ulong ChannelCategory { get; set; }
    public bool IsManageEnabled { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public GuildMessageTemplateEntity? ManageMessageTemplate { get; set; }
    public GuildTempVoicePresetEntity? TempVoicePreset { get; set; }
    public List<GuildTempVoiceChannelEntity> TempVoiceChannels { get; } = [];
    [Required] public GuildTempVoiceSettingsEntity GuildTempVoiceSettings { get; set; }
}