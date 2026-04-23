using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Entities.Guilds.MessageTemplates;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.TempVoice;

public class GuildTempVoiceConfigEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public ulong CreatorChannel { get; set; }
    [Required] public ulong ChannelCategory { get; set; }
    public bool IsManageEnabled { get; set; }
    
    public GuildMessageTemplateEntity? ManageMessageTemplate { get; set; }
    public GuildTempVoicePresetEntity? TempVoicePreset { get; set; }
    public List<GuildTempVoiceChannelEntity> TempVoiceChannels { get; } = [];
    [Required] public GuildTempVoiceSettingsEntity TempVoiceSettings { get; set; }
}