using DiscordBot.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Shared.Entities.Guilds;

namespace DiscordBot.Database;

public class DataContext : DbContext
{
    
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
public DbSet<GuildTempVoicePresetDiscordRolePermissionEntity> GuildTempVoicePresetDiscordRolePermissions { get; set; }
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

// TODO: LEVELS
public DbSet<GuildEntity> Guilds { get; set; }
public DbSet<GuildEntity> Guilds { get; set; }
public DbSet<GuildEntity> Guilds { get; set; }
public DbSet<GuildEntity> Guilds { get; set; }
public DbSet<GuildEntity> Guilds { get; set; }
public DbSet<GuildEntity> Guilds { get; set; }
public DbSet<GuildEntity> Guilds { get; set; }
public DbSet<GuildEntity> Guilds { get; set; }
public DbSet<GuildEntity> Guilds { get; set; }
public DbSet<GuildEntity> Guilds { get; set; }
public DbSet<GuildEntity> Guilds { get; set; }
public DbSet<GuildEntity> Guilds { get; set; }
public DbSet<GuildEntity> Guilds { get; set; }

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
}