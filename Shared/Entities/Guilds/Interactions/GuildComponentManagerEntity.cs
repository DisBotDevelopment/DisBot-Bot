using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Interactions;

public class GuildComponentManagerEntity
{
    public int Id { get; set; }
    public string? Selectmenus { get; set; }
    public string? Buttons { get; set; }
    public string? Modals { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}