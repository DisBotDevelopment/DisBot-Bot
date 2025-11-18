namespace Shared.Entities.Guilds.TempVoice;

public class TempVoiceChannelMembers
{
    public int Id { get; set; }
    public required ulong UserId { get; set; }
    public string[] Permissions { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public required TempVoiceChannels TempVoiceChannels { get; set; }
}