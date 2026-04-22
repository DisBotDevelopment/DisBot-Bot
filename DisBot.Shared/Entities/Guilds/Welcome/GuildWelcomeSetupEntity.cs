using System.ComponentModel.DataAnnotations;
using Shared.Entities.Guilds.MessageTemplates;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Welcome;

public class GuildWelcomeSetupEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public ulong ChannelId { get; set; }
    public bool HasImage { get; set; } = false;

    [Required] public GuildMessageTemplateEntity MessageTemplate { get; set; }

    public GuildWelcomeImageDataEntity? ImageData { get; set; }

    public int GuildId { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}