namespace Shared.Entities.Guilds.Polls;

public class PollAnswers
{
    public int Id { get; set; }
    public required ulong UserId { get; set; }
    public required Polls Poll { get; set; }
    public required PollOptions PollOptions { get; set; }
}