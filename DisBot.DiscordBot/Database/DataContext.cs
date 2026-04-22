using DiscordBot.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Shared.Entities.Guilds;
using Shared.Entities.Guilds.Automation;
using Shared.Entities.Guilds.ChannelLinks;
using Shared.Entities.Guilds.DiscordUtility;
using Shared.Entities.Guilds.Giveaways;
using Shared.Entities.Guilds.Interactions;
using Shared.Entities.Guilds.Leave;
using Shared.Entities.Guilds.Levels;
using Shared.Entities.Guilds.Logging;
using Shared.Entities.Guilds.MessageTemplates;
using Shared.Entities.Guilds.Moderation;
using Shared.Entities.Guilds.Moderation.AutoModeration;
using Shared.Entities.Guilds.Moderation.ModerationScout;
using Shared.Entities.Guilds.Moderation.Settings;
using Shared.Entities.Guilds.Notifications;
using Shared.Entities.Guilds.Polls;
using Shared.Entities.Guilds.Security;
using Shared.Entities.Guilds.TempVoice;
using Shared.Entities.Guilds.Tickets;
using Shared.Entities.Guilds.Welcome;
using Shared.Entities.Users;
using Shared.Entities.Users.Backup;
using Shared.Entities.Users.Vanity;

namespace DiscordBot.Database;

public class DataContext : DbContext
{
    #region Guild

    public DbSet<GuildEntity> Guilds { get; set; }

    public DbSet<GuildWelcomeSetupEntity> GuildWelcomeSetups { get; set; }
    public DbSet<GuildWelcomeImageDataEntity> GuildWelcomeImageData { get; set; }

    public DbSet<GuildTicketEntity> GuildTickets { get; set; }
    public DbSet<GuildTicketFeedbackEntity> GuildTicketFeedback { get; set; }
    public DbSet<GuildTicketModalDataEntity> GuildTicketModalData { get; set; }
    public DbSet<GuildTicketPermissionEntity> GuildTicketPermissions { get; set; }
    public DbSet<GuildTicketSetupEntity> GuildTicketSetups { get; set; }

    public DbSet<GuildTempVoiceChannelEntity> GuildTempVoiceChannels { get; set; }
    public DbSet<GuildTempVoiceChannelMemberEntity> GuildTempVoiceChannelMembers { get; set; }
    public DbSet<GuildTempVoiceConfigEntity> GuildTempVoiceConfigs { get; set; }

    public DbSet<GuildTempVoicePresetDiscordRolePermissionEntity> GuildTempVoicePresetDiscordRolePermissions
    {
        get;
        set;
    }

    public DbSet<GuildTempVoicePresetEntity> GuildTempVoicePresets { get; set; }
    public DbSet<GuildTempVoiceSettingsEntity> GuildTempVoiceSettings { get; set; }

    public DbSet<GuildSecurityEntity> GuildSecurity { get; set; }
    public DbSet<GuildVerificationGateEntity> GuildVerificationGates { get; set; }
    public DbSet<GuildVerificationGatesPermissionEntity> GuildVerificationGatesPermissions { get; set; }

    public DbSet<GuildPollAnswerEntity> GuildPollAnswers { get; set; }
    public DbSet<GuildPollEntity> GuildPolls { get; set; }
    public DbSet<GuildPollOptionEntity> GuildPollOptions { get; set; }

    public DbSet<GuildSpotifyNotificationEntity> GuildSpotifyNotifications { get; set; }
    public DbSet<GuildTwitchNotificationEntity> GuildTwitchNotifications { get; set; }
    public DbSet<GuildYoutubeNotificationEntity> GuildYoutubeNotifications { get; set; }

    public DbSet<GuildModerationEntity> GuildModeration { get; set; }
    public DbSet<GuildUserModerationEntity> GuildUserModerations { get; set; }
    public DbSet<GuildAutoModerationEntity> GuildAutoModerations { get; set; }
    public DbSet<GuildModerationScoutCaseEntity> GuildModerationScoutCases { get; set; }
    public DbSet<GuildModerationScoutEntity> GuildModerationScout { get; set; }
    public DbSet<GuildModerationScoutFormEntity> GuildModerationScoutForms { get; set; }
    public DbSet<GuildModerationScoutReportEntity> GuildModerationScoutReports { get; set; }
    public DbSet<GuildModerationScoutUserAppealEntity> GuildModerationScoutUserAppeals { get; set; }
    public DbSet<GuildBanModerationSettingsEntity> GuildBanModerationSettings { get; set; }
    public DbSet<GuildKickModerationSettingsEntity> GuildKickModerationSettings { get; set; }
    public DbSet<GuildMuteModerationSettingsEntity> GuildMuteModerationSettings { get; set; }
    public DbSet<GuildUnbanModerationSettingsEntity> GuildUnbanModerationSettings { get; set; }
    public DbSet<GuildUnmuteModerationSettingsEntity> GuildUnmuteModerationSettings { get; set; }
    public DbSet<GuildUnwarnModerationSettingsEntity> GuildUnwarnModerationSettings { get; set; }
    public DbSet<GuildWarnModerationSettingsEntity> GuildWarnModerationSettings { get; set; }

    public DbSet<GuildMessageTemplateEntity> GuildMessageTemplates { get; set; }

    public DbSet<GuildLoggingEntity> GuildLogging { get; set; }
    public DbSet<GuildLogsEntity> GuildLogs { get; set; }

    public DbSet<GuildLevelEntity> GuildLevel { get; set; }
    public DbSet<GuildXpDropEntity> GuildXpDrops { get; set; }
    public DbSet<GuildLevelSettingsEntity> GuildLevelSettings { get; set; }
    public DbSet<GuildXpStreakEntity> GuildXpStreaks { get; set; }

    public DbSet<GuildLeaveSetupEntity> GuildLeaveSetup { get; set; }
    public DbSet<GuildLeaveImageDataEntity> GuildLeaveImageData { get; set; }

    public DbSet<GuildBuildInCommandEntity> GuildBuildInCommands { get; set; }
    public DbSet<GuildCommandMangerEntity> GuildCommandManger { get; set; }
    public DbSet<GuildComponentManagerEntity> GuildComponentManager { get; set; }
    public DbSet<GuildInteractionManagerEntity> GuildInteractionManager { get; set; }
    public DbSet<GuildInteractionPermissionEntity> GuildInteractionPermissions { get; set; }

    public DbSet<GuildGiveawayEntity> GuildGiveaways { get; set; }

    public DbSet<GuildDiscordGuildAddonEntity> GuildDiscordGuildAddon { get; set; }

    public DbSet<GuildChannelLinksEntity> GuildChannelLinks { get; set; }
    public DbSet<GuildSyncedChannelLinkMessageEntity> GuildSyncedChannelLinkMessages { get; set; }

    public DbSet<GuildAutoDeleteEntity> GuildAutoDeletes { get; set; }
    public DbSet<GuildAutoRoleEntity> GuildAutoRoles { get; set; }
    public DbSet<GuildAutoPublishEntity> GuildAutoPublishes { get; set; }
    public DbSet<GuildAutoReactEntity> GuildAutoReacts { get; set; }

    #endregion

    #region User

    public DbSet<UserEntity> Users { get; set; }
    public DbSet<UserApiEntity> UserApis { get; set; }

    public DbSet<UserGuildBackupEntity> UserGuildBackups { get; set; }

    public DbSet<UserGuildVanityAnalyticsEntity> UserGuildVanityAnalytic { get; set; }
    public DbSet<UserGuildVanityAnalyticsLatest30DayEntity> UserGuildVanityAnalyticsLatest30Day { get; set; }
    public DbSet<UserGuildVanityEmbedAuthorEntity> UserGuildVanityEmbedAuthor { get; set; }
    public DbSet<UserGuildVanityEmbedEntity> UserGuildVanityEmbed { get; set; }
    public DbSet<UserGuildVanityEntity> UserGuildVanities { get; set; }

    #endregion
    
    #region Config

    private readonly IOptions<DatabaseOptions> Options;

    public DataContext(IOptions<DatabaseOptions> options)
    {
        Options = options;
    }

    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (optionsBuilder.IsConfigured)
            return;

        optionsBuilder.UseNpgsql(
            $"Host={Options.Value.Host};" +
            $"Port={Options.Value.Port};" +
            $"Username={Options.Value.Username};" +
            $"Password={Options.Value.Password};" +
            $"Database={Options.Value.Database}"
        );
    }

    #endregion
}