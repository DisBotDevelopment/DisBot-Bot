using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Interactions;

public class GuildComponentManagerEntity : IActionTimestamps
{
    public int Id { get; set; }
    // TODO: Add Custom Components
    // public string? Selectmenus { get; set; }
    // public string? Buttons { get; set; }
    //  public string? Modals { get; set; }

    public int GuildInteractionManagerId { get; set; }
    [Required] public GuildInteractionManagerEntity GuildInteractionManager { get; set; }
}