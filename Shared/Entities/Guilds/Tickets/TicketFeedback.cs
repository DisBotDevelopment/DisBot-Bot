namespace Shared.Entities.Guilds.Tickets;

public class TicketFeedback
{
    public int Id { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public bool Sent { get; set; }

    public DateTimeOffset? SubmittedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public Tickets Ticket { get; set; }
}