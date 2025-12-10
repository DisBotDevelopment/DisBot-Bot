using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Shared.Entities.Guilds.MessageTemplates;

namespace Shared.Entities.Guilds.Leave;

public class GuildLeaveSetupEntity
{
    public int Id { get; set; }
    [Required] public ulong ChannelId { get; set; }
    public bool HasImage { get; set; } = false;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public GuildLeaveImageDataEntity? ImageData { get; set; }
    [Required] public GuildMessageTemplateEntity GuildMessageTemplate { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}