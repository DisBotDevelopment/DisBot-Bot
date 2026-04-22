using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Interactions;

public class GuildBuildInCommandEntity : IActionTimestamps
{
    public int Id { get; set; }

    [Required] public string CustomName { get; set; }
    [Required] public string CodeName { get; set; }
    public string? Description { get; set; }
    public string[] Permissions { get; set; } = [];
    public bool IsEnabled { get; set; } = false;
    
    public GuildCommandMangerEntity GuildCommandManger { get; set; }
}