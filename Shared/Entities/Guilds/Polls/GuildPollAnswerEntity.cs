using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Polls;

public class GuildPollAnswerEntity
{
    public int Id { get; set; }
    [Required] public ulong UserId { get; set; }
    public string? Username { get; set; }
    [Required] public GuildPollEntity GuildPoll { get; set; }
    [Required] public GuildPollOptionEntity GuildPollOption { get; set; }
}