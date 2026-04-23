using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Entities.Guilds.Automation;
using DisBot.Shared.Entities.Guilds.ChannelLinks;
using DisBot.Shared.Entities.Guilds.DiscordUtility;
using DisBot.Shared.Entities.Guilds.Giveaways;
using DisBot.Shared.Entities.Guilds.Interactions;
using DisBot.Shared.Entities.Guilds.Leave;
using DisBot.Shared.Entities.Guilds.Levels;
using DisBot.Shared.Entities.Guilds.Logging;
using DisBot.Shared.Entities.Guilds.MessageTemplates;
using DisBot.Shared.Entities.Guilds.Moderation;
using DisBot.Shared.Entities.Guilds.Notifications;
using DisBot.Shared.Entities.Guilds.Polls;
using DisBot.Shared.Entities.Guilds.Security;
using DisBot.Shared.Entities.Guilds.TempVoice;
using DisBot.Shared.Entities.Guilds.Tickets;
using DisBot.Shared.Entities.Guilds.Welcome;

namespace DisBot.Shared.Entities.Guilds;

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
    public GuildModerationEntity? Moderation { get; set; }

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