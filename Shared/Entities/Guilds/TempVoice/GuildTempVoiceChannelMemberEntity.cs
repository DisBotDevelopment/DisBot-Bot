using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.TempVoice;

public class GuildTempVoiceChannelMemberEntity
{
    public int Id { get; set; }
    [Required] public ulong UserId { get; set; }
    public string[] Permissions { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildTempVoiceChannelEntity GuildTempVoiceChannel { get; set; }
}