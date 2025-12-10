using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Interactions;

public class GuildInteractionManagerEntity
{
    public int Id { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public GuildCommandMangerEntity CommandManager { get; set; } = new();
    public GuildComponentManagerEntity ComponentManager { get; set; } = new();
    [Required] public GuildEntity Guild { get; set; }
}