using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.TempVoice;

public class GuildTempVoiceChannelEntity
{
    public int Id { get; set; }

    [Required] public ulong ChannelId { get; set; }
    [Required] public ulong OwnerId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public List<GuildTempVoiceChannelMemberEntity> TempVoiceChannelMembers = [];

    [Required] public GuildTempVoiceConfigEntity GuildTempVoiceConfig { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}