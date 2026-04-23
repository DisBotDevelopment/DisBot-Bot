using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Entities.Guilds.MessageTemplates;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Polls;

public class GuildPollEntity : IActionTimestamps
{
    public int Id { get; set; }

    public ulong? MessageId { get; set; }
    public ulong? ChannelId { get; set; }
    public int MultiAnswers { get; set; }
    public int Time { get; set; }
    public ulong[] Entrys { get; set; } = [];
    public int Type { get; set; }
    public string[] Requirements { get; set; } = [];

    public GuildMessageTemplateEntity? MessageTemplates { get; set; }
    
    public List<GuildPollAnswerEntity> PollAnswers { get; set; } = [];
    public List<GuildPollOptionEntity> PollOptions { get; set; } = [];
    [Required] public GuildEntity Guild { get; set; }
}