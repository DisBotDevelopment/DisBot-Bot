using System.ComponentModel.DataAnnotations;
using Shared.Entities.Guilds.Leave;
using Shared.Entities.Guilds.MessageTemplates;

namespace Shared.Entities.Guilds.Welcome;

public class GuildWelcomeSetupEntity
{
    public int Id { get; set; }
    [Required] public ulong ChannelId { get; set; }
    public bool HasImage { get; set; } = false;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildMessageTemplateEntity GuildMessageTemplate { get; set; }

    public GuildWelcomeImageDataEntity? ImageData { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}