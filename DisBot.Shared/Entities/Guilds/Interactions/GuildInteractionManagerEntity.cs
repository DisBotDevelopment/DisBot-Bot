using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Interactions;

public class GuildInteractionManagerEntity : IActionTimestamps
{
    public int Id { get; set; }

    public GuildCommandMangerEntity CommandManager { get; set; }
    public GuildComponentManagerEntity ComponentManager { get; set; }

    public int GuildId { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}