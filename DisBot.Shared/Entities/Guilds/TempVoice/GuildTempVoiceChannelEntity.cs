using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.TempVoice;

public class GuildTempVoiceChannelEntity : IActionTimestamps
{
    public int Id { get; set; }

    [Required] public ulong ChannelId { get; set; }
    [Required] public ulong OwnerId { get; set; }

    public List<GuildTempVoiceChannelMemberEntity> TempVoiceChannelMembers = [];

    [Required] public GuildTempVoiceConfigEntity TempVoiceConfig { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}