using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities.Guilds.Polls;

public class Polls
{
    public int Id { get; set; }

    [Key] [Column("UUID")] public required Guid Uuid { get; set; }
    public ulong? MessageId { get; set; }
    public ulong? ChannelId { get; set; }
    public int MultiAnswers { get; set; }
    public int Time { get; set; }
    public ulong[] Entrys { get; set; } = [];
    public int Type { get; set; }
    public string[] Requirements { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public ICollection<PollAnswers> PollAnswers { get; set; } = [];
    public ICollection<PollOptions> PollOptions { get; set; } = [];

    public MessageTemplates.MessageTemplates? MessageTemplates { get; set; }
    public required Guild Guild { get; set; }
}