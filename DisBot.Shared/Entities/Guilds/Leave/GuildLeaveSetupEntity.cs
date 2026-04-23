using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Entities.Guilds.MessageTemplates;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Leave;

public class GuildLeaveSetupEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public ulong ChannelId { get; set; }
    public bool HasImage { get; set; } = false;
    
    public GuildLeaveImageDataEntity? ImageData { get; set; }
    [Required] public GuildMessageTemplateEntity GuildMessageTemplate { get; set; }
    
    public int GuildId { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}