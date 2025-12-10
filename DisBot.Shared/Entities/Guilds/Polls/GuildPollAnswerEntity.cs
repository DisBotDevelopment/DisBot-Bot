using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Polls;

public class GuildPollAnswerEntity
{
    public int Id { get; set; }
    [Required] public ulong UserId { get; set; }
    public string? Username { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    
    [Required] public GuildPollEntity Poll { get; set; }
    [Required] public GuildPollOptionEntity PollOption { get; set; }
}