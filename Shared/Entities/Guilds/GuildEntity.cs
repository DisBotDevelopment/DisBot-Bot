using System.ComponentModel.DataAnnotations;
using Shared.Entities.Guilds.Automation;
using Shared.Entities.Guilds.ChannelLinks;
using Shared.Entities.Guilds.DiscordUtility;
using Shared.Entities.Guilds.Giveaways;
using Shared.Entities.Guilds.Interactions;
using Shared.Entities.Guilds.Leave;
using Shared.Entities.Guilds.Levels;
using Shared.Entities.Guilds.Logging;
using Shared.Entities.Guilds.MessageTemplates;
using Shared.Entities.Guilds.Notifications;
using Shared.Entities.Guilds.Polls;
using Shared.Entities.Guilds.Security;
using Shared.Entities.Guilds.TempVoice;
using Shared.Entities.Guilds.Tickets;
using Shared.Entities.Guilds.Welcome;

namespace Shared.Entities.Guilds;

public class GuildEntity
{
    public int Id { get; set; }
    [Required] public ulong GuildId { get; set; }

    public string? GuildName { get; set; }
    public string? GuildOwner { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public GuildDiscordGuildAddonEntity? DiscordGuildAddon { get; set; }
    public GuildTempVoiceSettingsEntity? TempVoice { get; set; }
    public GuildLeaveSetupEntity? LeaveSetup { get; set; }
    public GuildWelcomeSetupEntity? WelcomeSetup { get; set; }
    public GuildLoggingEntity? Logging { get; set; }
    public GuildSecurityEntity? Security { get; set; }
    public GuildLevelSettingsEntity? LevelSettings { get; set; }
    public GuildAutoPublishEntity? AutoPublish { get; set; }
    public GuildAutoRoleEntity? AutoRole { get; set; }
    public GuildInteractionManagerEntity? InteractionManager { get; set; }

    public List<GuildMessageTemplateEntity> MessageTemplates { get; set; } = [];
    public List<GuildSpotifyNotificationEntity> SpotifyNotification { get; set; } = [];
    public List<GuildTwitchNotificationEntity> TwitchNotification { get; set; } = [];
    public List<GuildYoutubeNotificationEntity> YoutubeNotification { get; set; } = [];
    public List<GuildGiveawayEntity> Giveaways { get; set; } = [];
    public List<GuildLogsEntity> Logs { get; set; } = [];
    public List<GuildTicketSetupEntity> TicketSetups { get; set; } = [];
    public List<GuildPollEntity> Polls { get; set; } = [];
    public List<GuildAutoDeleteEntity> AutoDelete { get; set; } = [];
    public List<GuildAutoReactEntity> AutoReact { get; set; } = [];
    public List<GuildChannelLinksEntity> ChannelLinks { get; set; } = [];
}