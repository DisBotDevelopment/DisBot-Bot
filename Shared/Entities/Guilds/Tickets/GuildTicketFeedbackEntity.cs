using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Tickets;

public class GuildTicketFeedbackEntity
{
    public int Id { get; set; }
    [Required] public int Rating { get; set; }
    public string? Comment { get; set; }
    public bool Sent { get; set; } = false;

    public DateTimeOffset? SubmittedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildTicketEntity Ticket { get; set; }
}