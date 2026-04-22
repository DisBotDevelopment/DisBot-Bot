using System.ComponentModel.DataAnnotations;
using Shared.Enums.Ticket;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Tickets;

public class GuildTicketModalDataEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public string Name { get; set; }
    public string? Placeholder { get; set; }
    [Required] public TicketModalType Type { get; set; }
    public int? MinLength { get; set; }
    public int? MaxLength { get; set; }
    public bool Required { get; set; } = true;

    [Required] public GuildTicketSetupEntity TicketSetup { get; set; }
}