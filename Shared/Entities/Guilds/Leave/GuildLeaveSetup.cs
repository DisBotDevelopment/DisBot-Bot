using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Shared.Entities.Guilds.Leave;

public class GuildLeaveSetup
{
    public int Id { get; set; }
    public required ulong ChannelId { get; set; }
    [Column("Image")] public bool HasImage { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public required MessageTemplates.MessageTemplates MessageTemplate { get; set; }
    public LeaveImageData? ImageData { get; set; }
    public required Guild Guild { get; set; }
}