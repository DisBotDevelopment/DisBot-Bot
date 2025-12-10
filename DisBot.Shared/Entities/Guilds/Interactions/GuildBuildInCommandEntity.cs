using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Interactions;

public class GuildBuildInCommandEntity
{
    public int Id { get; set; }

    [Required] public string CustomName { get; set; }
    [Required] public string CodeName { get; set; }
    public string? Description { get; set; }
    public string[] Permissions { get; set; } = [];
    public bool IsEnabled { get; set; } = false;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public GuildCommandMangerEntity GuildCommandManger { get; set; }
}