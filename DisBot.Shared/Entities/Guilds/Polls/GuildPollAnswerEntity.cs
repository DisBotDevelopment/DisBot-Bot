using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Polls;

public class GuildPollAnswerEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public ulong UserId { get; set; }
    public string? Username { get; set; }
    
    [Required] public GuildPollEntity Poll { get; set; }
    [Required] public GuildPollOptionEntity PollOption { get; set; }
}