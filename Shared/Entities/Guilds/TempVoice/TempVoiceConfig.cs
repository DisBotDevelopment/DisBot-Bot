using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities.Guilds.TempVoice;

public class TempVoiceConfig
{
    public int Id { get; set; }
    [Column("UUID")] public required Guid Uuid { get; set; }
    public string? CreatorChannel { get; set; }
    public string? ChannelCategory { get; set; }
    public string? ManageMessageTemplateId { get; set; }
    public bool IsManageEnabled { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public ICollection<TempVoiceChannels> TempVoiceChannels { get; } = new List<TempVoiceChannels>();
    public TempVoicePreset? TempVoicePreset { get; set; }

    public required TempVoice TempVoice { get; set; }
}