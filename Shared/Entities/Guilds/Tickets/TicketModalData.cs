using NetCord.Rest;

namespace Shared.Entities.Guilds.Tickets;

public class TicketModalData
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Placeholder { get; set; }
    public required int Type { get; set; }
    public int? MinLength { get; set; }
    public int? MaxLength { get; set; }
    public bool Required { get; set; } = true;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public required TicketSetups TicketSetup { get; set; }
}