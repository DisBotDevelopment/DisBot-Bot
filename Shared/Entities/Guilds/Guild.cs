using System.ComponentModel.DataAnnotations;
using Shared.Entities.Guilds.DiscordUtility;
using Shared.Entities.Guilds.Leave;
using Shared.Entities.Guilds.Logging;
using Shared.Entities.Guilds.Security;
using Shared.Entities.Guilds.Tickets;

namespace Shared.Entities.Guilds;

public class Guild
{
    [Key] public int Id { get; set; }
    public required ulong GuildId { get; set; }

    public string? GuildName { get; set; }
    public string? GuildOwner { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public TempVoice.TempVoice? TempVoice { get; set; }
    public GuildWelcomeSetup? GuildWelcomeSetup { get; set; }
    public GuildLeaveSetup? GuildLeaveSetup { get; set; }
    public GuildLogging? GuildLogging { get; set; }
    public ICollection<GuildLogs>? GuildLogs { get; set; }
    public GuildSecurity? GuildSecurity { get; set; }

    public List<TicketSetups> TicketSetups { get; set; } = new List<TicketSetups>();
    public List<Polls.Polls> Polls { get; set; } = new List<Polls.Polls>();
    public ICollection<DiscordGuildAddon> DiscordGuildAddon { get; set; } = new List<DiscordGuildAddon>();
    public ICollection<Giveaways.Giveaways> Giveaways { get; set; } = new List<Giveaways.Giveaways>();
}