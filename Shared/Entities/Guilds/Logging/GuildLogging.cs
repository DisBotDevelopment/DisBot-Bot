using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities.Guilds.Logging;

public class GuildLogging
{
    public int Id { get; set; }
    public string? AutoMod { get; set; }
    public string? Channel { get; set; }
    public string? Emoji { get; set; }
    [Column("Guild")] public string? Server { get; set; }
    public string? Integration { get; set; }
    public string? Invite { get; set; }
    public string? Member { get; set; }
    public string? Message { get; set; }
    public string? Moderation { get; set; }
    public string? Reaction { get; set; }
    public string? Role { get; set; }
    public string? SoundBoard { get; set; }
    public string? Sticker { get; set; }
    public string? Thread { get; set; }
    public string? Voice { get; set; }
    public string? Webhook { get; set; }
    public string? Ban { get; set; }
    public string? Kick { get; set; }
    public string? Poll { get; set; }
    public string? Stage { get; set; }
    public string? Event { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public required Guild Guild { get; set; }
}