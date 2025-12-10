using System.ComponentModel.DataAnnotations;
using NetCord.Rest;
using Shared.Enums.Ticket;

namespace Shared.Entities.Guilds.Tickets;

public class GuildTicketModalDataEntity
{
    public int Id { get; set; }
    [Required] public string Name { get; set; }
    public string? Placeholder { get; set; }
    [Required] public TicketModalType Type { get; set; }
    public int? MinLength { get; set; }
    public int? MaxLength { get; set; }
    public bool Required { get; set; } = true;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildTicketSetupEntity TicketSetup { get; set; }
}