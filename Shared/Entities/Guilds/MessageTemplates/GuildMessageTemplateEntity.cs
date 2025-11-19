using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities.Guilds.MessageTemplates;

public class GuildMessageTemplateEntity
{
    public int Id { get; set; }
    [Required] public string Name { get; set; }

    public bool IsComponentsV2Message { get; set; }
    public string? Content { get; set; }
    public string? EmbedJson { get; set; }
    public string? OtherEmbeds { get; set; }
    public string? ComponentJson { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildEntity Guild { get; set; }
}