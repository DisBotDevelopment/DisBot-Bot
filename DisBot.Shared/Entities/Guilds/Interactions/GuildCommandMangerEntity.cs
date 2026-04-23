using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Interactions;

public class GuildCommandMangerEntity : IActionTimestamps
{
    public int Id { get; set; }
    // TODO: Add Custom Commands
    //  public string? Commands { get; set; }
    // public string? SubCommands { get; set; }
    //  public string? SubCommandGroups { get; set; }
    //  public string? ContextMenus { get; set; }

    public List<GuildBuildInCommandEntity> BuildInCommands { get; set; } = [];
    
    public int InteractionManagerId { get; set; }
    [Required] public GuildInteractionManagerEntity InteractionManager { get; set; }
}