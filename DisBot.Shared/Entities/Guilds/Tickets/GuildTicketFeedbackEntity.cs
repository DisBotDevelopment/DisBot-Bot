using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Tickets;

public class GuildTicketFeedbackEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public int Rating { get; set; }
    public string? Comment { get; set; }
    public bool Sent { get; set; } = false;

    public DateTimeOffset? SubmittedAt { get; set; }

    public int TicketId { get; set; }
    [Required] public GuildTicketEntity Ticket { get; set; }
}