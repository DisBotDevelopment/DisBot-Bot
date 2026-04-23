using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Polls;

public class GuildPollOptionEntity : IActionTimestamps
{
    public int Id { get; set; }
    public string? Label { get; set; }
    public string? Description { get; set; }
    public string? Emoji { get; set; }
    public ulong[] UserIds { get; set; } = [];

    public List<GuildPollAnswerEntity> PollAnswers { get; set; } = [];
    [Required] public GuildPollEntity Poll { get; set; }
}