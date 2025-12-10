using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Polls;

public class GuildPollOptionEntity
{
    public int Id { get; set; }
    public string? Label { get; set; }
    public string? Description { get; set; }
    public string? Emoji { get; set; }
    public ulong[] UserIds { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public List<GuildPollAnswerEntity> PollAnswers { get; set; } = [];
    [Required] public GuildPollEntity Poll { get; set; }
}