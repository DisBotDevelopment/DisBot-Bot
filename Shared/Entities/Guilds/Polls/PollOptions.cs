namespace Shared.Entities.Guilds.Polls;

public class PollOptions
{
    public int Id { get; set; }
    public string? Label { get; set; }
    public string? Description { get; set; }
    public string? Emoji { get; set; }
    public ulong[] UserIds { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public ICollection<PollAnswers> PollAnswers { get; set; } = new List<PollAnswers>();
    public required Polls Poll { get; set; }
}