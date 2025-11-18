using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities.Guilds.MessageTemplates;

public class MessageTemplates
{
    public int Id { get; set; }
    public required string Name { get; set; }

    public string? Content { get; set; }
    [Column("EmbedJSON")] public string? EmbedJson { get; set; }
    public string? OtherEmbeds { get; set; }
    [Column("ComponentJSON")] public string? ComponentJson { get; set; }
    public bool IsComponentsV2Message { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public required Guild Guild { get; set; }
}