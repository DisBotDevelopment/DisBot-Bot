namespace Shared.Entities.Guilds.TempVoice;

public class TempVoiceChannels
{
    public int Id { get; set; }

    public required ulong ChannelId { get; set; }
    public required ulong OwnerId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public ICollection<TempVoiceChannelMembers> TempVoiceChannelMembers = new List<TempVoiceChannelMembers>();

    public required TempVoiceConfig TempVoiceConfig { get; set; }
    public required Guild Guild { get; set; }
}