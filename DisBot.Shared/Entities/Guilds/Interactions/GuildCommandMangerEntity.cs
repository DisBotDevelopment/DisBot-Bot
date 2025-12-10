using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Interactions;

public class GuildCommandMangerEntity
{
    public int Id { get; set; }
    // TODO: Add Custom Commands
    //  public string? Commands { get; set; }
    // public string? SubCommands { get; set; }
    //  public string? SubCommandGroups { get; set; }
    //  public string? ContextMenus { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public List<GuildBuildInCommandEntity> BuildInCommands { get; set; } = [];
    [Required] public GuildInteractionManagerEntity InteractionManager { get; set; }
}