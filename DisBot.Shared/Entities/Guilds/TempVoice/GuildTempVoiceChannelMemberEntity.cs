using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.TempVoice;

public class GuildTempVoiceChannelMemberEntity :IActionTimestamps
{
    public int Id { get; set; }
    [Required] public ulong UserId { get; set; }
    public string[] Permissions { get; set; } = [];

    [Required] public GuildTempVoiceChannelEntity TempVoiceChannel { get; set; }
}