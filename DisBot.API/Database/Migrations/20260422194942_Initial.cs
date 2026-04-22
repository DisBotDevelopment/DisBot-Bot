using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DisBot.API.Database.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Guilds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GuildId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    GuildName = table.Column<string>(type: "text", nullable: true),
                    GuildOwner = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Guilds", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    AccessToken = table.Column<string>(type: "text", nullable: false),
                    RefreshToken = table.Column<string>(type: "text", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: true),
                    LastVote = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    BackupCount = table.Column<int>(type: "integer", nullable: false),
                    InvalidateTimestamp = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GuildAutoDeletes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Time = table.Column<int>(type: "integer", nullable: false),
                    WhitelistedMessageIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    WhitelistedRoleIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    WhitelistedUserIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildAutoDeletes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildAutoDeletes_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildAutoPublishes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChannelIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildAutoPublishes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildAutoPublishes_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildAutoReacts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    Emoji = table.Column<string>(type: "text", nullable: false),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildAutoReacts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildAutoReacts_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildAutoRoles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildAutoRoles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildAutoRoles_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildChannelLinks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    WebhookUrl = table.Column<string>(type: "text", nullable: false),
                    SyncFlags = table.Column<string[]>(type: "text[]", nullable: false),
                    LinkedWith = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    UsersCanSelectIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildChannelLinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildChannelLinks_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildDiscordGuildAddon",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    OnlyMedia = table.Column<string[]>(type: "text[]", nullable: true),
                    NoLinkEmbeds = table.Column<string[]>(type: "text[]", nullable: true),
                    InvitesPaused = table.Column<bool>(type: "boolean", nullable: false),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildDiscordGuildAddon", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildDiscordGuildAddon_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildInteractionManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildInteractionManager", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildInteractionManager_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildInteractionPermissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    CustomId = table.Column<string>(type: "text", nullable: true),
                    CommandName = table.Column<string>(type: "text", nullable: true),
                    RoleIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    UserIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    ChannelIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    DisableInternalUserPermission = table.Column<bool>(type: "boolean", nullable: false),
                    OnlyGuildOwner = table.Column<bool>(type: "boolean", nullable: false),
                    Cooldown = table.Column<int>(type: "integer", nullable: true),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildInteractionPermissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildInteractionPermissions_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildLogging",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IsLoggingEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AutoModWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    ChannelWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    EmojiWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    GuildWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    IntegrationWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    InviteWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    MemberWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    MessageWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    ModerationWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    ReactionWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    RoleWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    SoundBoardWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    StickerWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    ThreadWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    VoiceWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    WebhookWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    BanWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    KickWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    PollWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    StageWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    EventWebhookUrl = table.Column<string>(type: "text", nullable: true),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildLogging", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildLogging_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LoggingType = table.Column<string>(type: "text", nullable: false),
                    Notes = table.Column<string[]>(type: "text[]", nullable: false),
                    LogMessage = table.Column<string>(type: "text", nullable: true),
                    LogJson = table.Column<string>(type: "text", nullable: true),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildLogs_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildMessageTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    IsComponentsV2Message = table.Column<bool>(type: "boolean", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: true),
                    EmbedJson = table.Column<string>(type: "text", nullable: true),
                    OtherEmbeds = table.Column<string>(type: "text", nullable: true),
                    ComponentJson = table.Column<string>(type: "text", nullable: true),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildMessageTemplates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildMessageTemplates_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildModeration",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildModeration", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildModeration_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildSecurity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InviteLoggingActive = table.Column<bool>(type: "boolean", nullable: true),
                    MaxAccountAge = table.Column<int>(type: "integer", nullable: true),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildSecurity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildSecurity_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserApis",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Key = table.Column<Guid>(type: "uuid", nullable: false),
                    Permissions = table.Column<string[]>(type: "text[]", nullable: true),
                    Flags = table.Column<string[]>(type: "text[]", nullable: true),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserApis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserApis_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserGuildBackups",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BackupJson = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGuildBackups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserGuildBackups_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserGuildVanities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Host = table.Column<string>(type: "text", nullable: false),
                    Invite = table.Column<string>(type: "text", nullable: false),
                    InDiscovery = table.Column<bool>(type: "boolean", nullable: false),
                    IsBannedFromDiscover = table.Column<bool>(type: "boolean", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGuildVanities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserGuildVanities_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildSyncedChannelLinkMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserMessageId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    WebhookMessageId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    WebhookUrl = table.Column<string>(type: "text", nullable: true),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    ChannelLinksId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildSyncedChannelLinkMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildSyncedChannelLinkMessages_GuildChannelLinks_ChannelLin~",
                        column: x => x.ChannelLinksId,
                        principalTable: "GuildChannelLinks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildCommandManger",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InteractionManagerId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildCommandManger", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildCommandManger_GuildInteractionManager_InteractionManag~",
                        column: x => x.InteractionManagerId,
                        principalTable: "GuildInteractionManager",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildComponentManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GuildInteractionManagerId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildComponentManager", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildComponentManager_GuildInteractionManager_GuildInteract~",
                        column: x => x.GuildInteractionManagerId,
                        principalTable: "GuildInteractionManager",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildGiveaways",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MessageId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    Prize = table.Column<string>(type: "text", nullable: true),
                    Winners = table.Column<int>(type: "integer", nullable: false),
                    Time = table.Column<int>(type: "integer", nullable: true),
                    IsEnded = table.Column<bool>(type: "boolean", nullable: false),
                    EndedBy = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    IsPaused = table.Column<bool>(type: "boolean", nullable: false),
                    IsRerolled = table.Column<bool>(type: "boolean", nullable: false),
                    WinnerIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    HostedBy = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    Entrys = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    Requirements = table.Column<string[]>(type: "text[]", nullable: false),
                    EndedMessageTemplateId = table.Column<int>(type: "integer", nullable: true),
                    MessageTemplateId = table.Column<int>(type: "integer", nullable: true),
                    WinnerMessageTemplateId = table.Column<int>(type: "integer", nullable: true),
                    EndedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildGiveaways", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildGiveaways_GuildMessageTemplates_EndedMessageTemplateId",
                        column: x => x.EndedMessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildGiveaways_GuildMessageTemplates_MessageTemplateId",
                        column: x => x.MessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildGiveaways_GuildMessageTemplates_WinnerMessageTemplateId",
                        column: x => x.WinnerMessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildGiveaways_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildLeaveSetup",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    HasImage = table.Column<bool>(type: "boolean", nullable: false),
                    GuildMessageTemplateId = table.Column<int>(type: "integer", nullable: false),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildLeaveSetup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildLeaveSetup_GuildMessageTemplates_GuildMessageTemplateId",
                        column: x => x.GuildMessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GuildLeaveSetup_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildLevelSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LevelUpChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    LeaderboardDisplayAmount = table.Column<int>(type: "integer", nullable: false),
                    RequiredXpForFirstLevel = table.Column<int>(type: "integer", nullable: true),
                    MessageXpRange = table.Column<string>(type: "text", nullable: true),
                    VoiceXpRange = table.Column<string>(type: "text", nullable: true),
                    VoiceXpCooldown = table.Column<int>(type: "integer", nullable: false),
                    ExcludedChannelIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: true),
                    ExcludeUserIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: true),
                    ExcludeRoleIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: true),
                    IsLevelModuleEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    IsMessageXpEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    IsVoiceXpEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    MessageXpCooldown = table.Column<int>(type: "integer", nullable: true),
                    MessageXpType = table.Column<int[]>(type: "integer[]", nullable: false),
                    RequiredXpFormular = table.Column<string>(type: "text", nullable: true),
                    LevelUpMessageType = table.Column<int>(type: "integer", nullable: true),
                    XpStreaksMessageType = table.Column<int>(type: "integer", nullable: true),
                    XpStreaksMessageChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    XpStreaksIncreaseType = table.Column<int[]>(type: "integer[]", nullable: true),
                    LeaderboardMessageTemplateId = table.Column<int>(type: "integer", nullable: true),
                    LevelUpMessageTemplateId = table.Column<int>(type: "integer", nullable: true),
                    LevelUserInfoMessageTemplateId = table.Column<int>(type: "integer", nullable: true),
                    XpDropsMessageTemplateId = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    GuildId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildLevelSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildLevelSettings_GuildMessageTemplates_LeaderboardMessage~",
                        column: x => x.LeaderboardMessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildLevelSettings_GuildMessageTemplates_LevelUpMessageTemp~",
                        column: x => x.LevelUpMessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildLevelSettings_GuildMessageTemplates_LevelUserInfoMessa~",
                        column: x => x.LevelUserInfoMessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildLevelSettings_GuildMessageTemplates_XpDropsMessageTemp~",
                        column: x => x.XpDropsMessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildLevelSettings_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildPolls",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MessageId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    MultiAnswers = table.Column<int>(type: "integer", nullable: false),
                    Time = table.Column<int>(type: "integer", nullable: false),
                    Entrys = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Requirements = table.Column<string[]>(type: "text[]", nullable: false),
                    MessageTemplatesId = table.Column<int>(type: "integer", nullable: true),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildPolls", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildPolls_GuildMessageTemplates_MessageTemplatesId",
                        column: x => x.MessageTemplatesId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildPolls_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildSpotifyNotifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ShowId = table.Column<string>(type: "text", nullable: false),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    Latest = table.Column<string[]>(type: "text[]", nullable: false),
                    PingRoleIds = table.Column<string[]>(type: "text[]", nullable: false),
                    MessageTemplateId = table.Column<int>(type: "integer", nullable: true),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildSpotifyNotifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildSpotifyNotifications_GuildMessageTemplates_MessageTemp~",
                        column: x => x.MessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildSpotifyNotifications_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildTempVoiceSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserInviteMessageTemplateId = table.Column<int>(type: "integer", nullable: true),
                    ModeratorUserIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    TempVoiceLogChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildTempVoiceSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildTempVoiceSettings_GuildMessageTemplates_UserInviteMess~",
                        column: x => x.UserInviteMessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildTempVoiceSettings_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildTicketSetups",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChannelType = table.Column<int>(type: "integer", nullable: false),
                    CategoryId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    CustomId = table.Column<string>(type: "text", nullable: false),
                    TicketChannelName = table.Column<string>(type: "text", nullable: true),
                    EnableTicketsOnlyFromTime = table.Column<string>(type: "text", nullable: true),
                    MessageTemplateId = table.Column<string>(type: "text", nullable: true),
                    TicketBlacklistRoles = table.Column<string[]>(type: "text[]", nullable: false),
                    TranscriptChannelId = table.Column<string>(type: "text", nullable: true),
                    HasModal = table.Column<bool>(type: "boolean", nullable: false),
                    ModalTitle = table.Column<string>(type: "text", nullable: true),
                    OnlyClaimMode = table.Column<bool>(type: "boolean", nullable: false),
                    TicketLimit = table.Column<int>(type: "integer", nullable: true),
                    WithTicketFeedback = table.Column<bool>(type: "boolean", nullable: false),
                    TicketFeedbackChannelId = table.Column<string>(type: "text", nullable: true),
                    TicketCreationCooldownPerUser = table.Column<int>(type: "integer", nullable: true),
                    AutoCloseAfterInactivity = table.Column<int>(type: "integer", nullable: true),
                    AutoCloseAfterTime = table.Column<int>(type: "integer", nullable: true),
                    AutoAssignHandler = table.Column<string>(type: "text", nullable: true),
                    TicketRateLimit = table.Column<string>(type: "text", nullable: true),
                    TicketStatusChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    AutoCloseAction = table.Column<string[]>(type: "text[]", nullable: false),
                    OldTicketCategoryId = table.Column<string>(type: "text", nullable: true),
                    RequiredRoles = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    SlashCommandId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    SlashCommandName = table.Column<string>(type: "text", nullable: true),
                    SlashCommandDescription = table.Column<string>(type: "text", nullable: true),
                    TextCommandName = table.Column<string>(type: "text", nullable: true),
                    SendTranscriptToUser = table.Column<bool>(type: "boolean", nullable: false),
                    TicketSettings = table.Column<string[]>(type: "text[]", nullable: false),
                    UserDmWhenCloseMessageTemplateIdId = table.Column<int>(type: "integer", nullable: true),
                    AutoReplyMessageTemplateIdId = table.Column<int>(type: "integer", nullable: true),
                    TicketStatusMessageTemplateIdId = table.Column<int>(type: "integer", nullable: true),
                    TicketStatusMessageIdId = table.Column<int>(type: "integer", nullable: true),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildTicketSetups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildTicketSetups_GuildMessageTemplates_AutoReplyMessageTem~",
                        column: x => x.AutoReplyMessageTemplateIdId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildTicketSetups_GuildMessageTemplates_TicketStatusMessage~",
                        column: x => x.TicketStatusMessageIdId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildTicketSetups_GuildMessageTemplates_TicketStatusMessag~1",
                        column: x => x.TicketStatusMessageTemplateIdId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildTicketSetups_GuildMessageTemplates_UserDmWhenCloseMess~",
                        column: x => x.UserDmWhenCloseMessageTemplateIdId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildTicketSetups_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildTwitchNotifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TwitchChannelName = table.Column<string>(type: "text", nullable: false),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    IsLive = table.Column<bool>(type: "boolean", nullable: false),
                    PingRoleIds = table.Column<string[]>(type: "text[]", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    MessageTemplateId = table.Column<int>(type: "integer", nullable: true),
                    GuildsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildTwitchNotifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildTwitchNotifications_GuildMessageTemplates_MessageTempl~",
                        column: x => x.MessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildTwitchNotifications_Guilds_GuildsId",
                        column: x => x.GuildsId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildWelcomeSetups",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    HasImage = table.Column<bool>(type: "boolean", nullable: false),
                    MessageTemplateId = table.Column<int>(type: "integer", nullable: false),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildWelcomeSetups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildWelcomeSetups_GuildMessageTemplates_MessageTemplateId",
                        column: x => x.MessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GuildWelcomeSetups_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildYoutubeNotifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    YoutubeChannelId = table.Column<string>(type: "text", nullable: false),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    Latest = table.Column<string[]>(type: "text[]", nullable: true),
                    PingRoleIds = table.Column<string[]>(type: "text[]", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    MessageTemplateId = table.Column<int>(type: "integer", nullable: true),
                    GuildId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildYoutubeNotifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildYoutubeNotifications_GuildMessageTemplates_MessageTemp~",
                        column: x => x.MessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildYoutubeNotifications_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildAutoModerations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    RegexPattern = table.Column<string>(type: "text", nullable: true),
                    ExcludedChannelIds = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    ExcludedRoleIds = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    Actions = table.Column<string>(type: "jsonb", nullable: false),
                    Triggers = table.Column<string>(type: "jsonb", nullable: false),
                    ModerationId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildAutoModerations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildAutoModerations_GuildModeration_ModerationId",
                        column: x => x.ModerationId,
                        principalTable: "GuildModeration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildBanModerationSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DefaultReason = table.Column<string>(type: "text", nullable: false),
                    AuditLogReason = table.Column<string>(type: "text", nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    DeleteProveMessage = table.Column<bool>(type: "boolean", nullable: false),
                    NeedReason = table.Column<bool>(type: "boolean", nullable: false),
                    ModerationId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildBanModerationSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildBanModerationSettings_GuildModeration_ModerationId",
                        column: x => x.ModerationId,
                        principalTable: "GuildModeration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildKickModerationSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DefaultReason = table.Column<string>(type: "text", nullable: false),
                    AuditLogReason = table.Column<string>(type: "text", nullable: false),
                    NeedReason = table.Column<bool>(type: "boolean", nullable: false),
                    ModerationId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildKickModerationSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildKickModerationSettings_GuildModeration_ModerationId",
                        column: x => x.ModerationId,
                        principalTable: "GuildModeration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildModerationScout",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PublicBanListUrl = table.Column<string>(type: "text", nullable: false),
                    AdminBanList = table.Column<string>(type: "jsonb", nullable: true),
                    IsPublicBanListEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    MustModeratorApprovePublicBan = table.Column<bool>(type: "boolean", nullable: false),
                    ModeratorRoleIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    ReportCommandId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    ReportMessageContextId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    ReportUserContextId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    ImmuneReportRoleIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    NotAllowedToReportRoleIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    SuccessReportMessageIdId = table.Column<int>(type: "integer", nullable: true),
                    ModerationId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildModerationScout", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildModerationScout_GuildMessageTemplates_SuccessReportMes~",
                        column: x => x.SuccessReportMessageIdId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildModerationScout_GuildModeration_ModerationId",
                        column: x => x.ModerationId,
                        principalTable: "GuildModeration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildMuteModerationSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DefaultReason = table.Column<string>(type: "text", nullable: false),
                    AuditLogReason = table.Column<string>(type: "text", nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    Actions = table.Column<string[]>(type: "text[]", nullable: false),
                    DeleteProveMessage = table.Column<bool>(type: "boolean", nullable: false),
                    NeedReason = table.Column<bool>(type: "boolean", nullable: false),
                    UseTimeout = table.Column<bool>(type: "boolean", nullable: false),
                    ModerationId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildMuteModerationSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildMuteModerationSettings_GuildModeration_ModerationId",
                        column: x => x.ModerationId,
                        principalTable: "GuildModeration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildUnbanModerationSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DefaultReason = table.Column<string>(type: "text", nullable: false),
                    AuditLogReason = table.Column<string>(type: "text", nullable: false),
                    NeedReason = table.Column<bool>(type: "boolean", nullable: false),
                    ModerationId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildUnbanModerationSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildUnbanModerationSettings_GuildModeration_ModerationId",
                        column: x => x.ModerationId,
                        principalTable: "GuildModeration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildUnmuteModerationSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DefaultReason = table.Column<string>(type: "text", nullable: false),
                    AuditLogReason = table.Column<string>(type: "text", nullable: false),
                    Actions = table.Column<string[]>(type: "text[]", nullable: false),
                    NeedReason = table.Column<bool>(type: "boolean", nullable: false),
                    ModerationId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildUnmuteModerationSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildUnmuteModerationSettings_GuildModeration_ModerationId",
                        column: x => x.ModerationId,
                        principalTable: "GuildModeration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildUnwarnModerationSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DefaultReason = table.Column<string>(type: "text", nullable: false),
                    AuditLogReason = table.Column<string>(type: "text", nullable: false),
                    Actions = table.Column<string[]>(type: "text[]", nullable: false),
                    NeedReason = table.Column<bool>(type: "boolean", nullable: false),
                    ModerationId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildUnwarnModerationSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildUnwarnModerationSettings_GuildModeration_ModerationId",
                        column: x => x.ModerationId,
                        principalTable: "GuildModeration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildWarnModerationSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DefaultReason = table.Column<string>(type: "text", nullable: false),
                    AuditLogReason = table.Column<string>(type: "text", nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    Actions = table.Column<string[]>(type: "text[]", nullable: false),
                    DeleteProveMessage = table.Column<bool>(type: "boolean", nullable: false),
                    NeedReason = table.Column<bool>(type: "boolean", nullable: false),
                    ModerationId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildWarnModerationSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildWarnModerationSettings_GuildModeration_ModerationId",
                        column: x => x.ModerationId,
                        principalTable: "GuildModeration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildVerificationGates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    MessageId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    Action = table.Column<int>(type: "integer", nullable: true),
                    VerificationType = table.Column<int>(type: "integer", nullable: true),
                    VerifiedUsers = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false),
                    RoleIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    SecurityId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildVerificationGates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildVerificationGates_GuildSecurity_SecurityId",
                        column: x => x.SecurityId,
                        principalTable: "GuildSecurity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserGuildVanityAnalytic",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Clicks = table.Column<int>(type: "integer", nullable: true),
                    TrackInviteWithLog = table.Column<bool>(type: "boolean", nullable: false),
                    UniqueClicks = table.Column<int>(type: "integer", nullable: false),
                    JoinedWithCode = table.Column<int>(type: "integer", nullable: false),
                    LoggedIps = table.Column<string[]>(type: "text[]", nullable: true),
                    TrackMessageTemplateId = table.Column<int>(type: "integer", nullable: true),
                    GuildVanityId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGuildVanityAnalytic", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserGuildVanityAnalytic_GuildMessageTemplates_TrackMessageT~",
                        column: x => x.TrackMessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UserGuildVanityAnalytic_UserGuildVanities_GuildVanityId",
                        column: x => x.GuildVanityId,
                        principalTable: "UserGuildVanities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserGuildVanityEmbed",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Color = table.Column<string>(type: "text", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    ThumbnailUrl = table.Column<string>(type: "text", nullable: true),
                    GuildVanityId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGuildVanityEmbed", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserGuildVanityEmbed_UserGuildVanities_GuildVanityId",
                        column: x => x.GuildVanityId,
                        principalTable: "UserGuildVanities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildBuildInCommands",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CustomName = table.Column<string>(type: "text", nullable: false),
                    CodeName = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Permissions = table.Column<string[]>(type: "text[]", nullable: false),
                    IsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    GuildCommandMangerId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildBuildInCommands", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildBuildInCommands_GuildCommandManger_GuildCommandMangerId",
                        column: x => x.GuildCommandMangerId,
                        principalTable: "GuildCommandManger",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildLeaveImageData",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: false),
                    Subtitle = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: false),
                    Background = table.Column<string>(type: "text", nullable: true),
                    Theme = table.Column<string>(type: "text", nullable: true),
                    Gradient = table.Column<string>(type: "text", nullable: true),
                    LeaveSetupId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildLeaveImageData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildLeaveImageData_GuildLeaveSetup_LeaveSetupId",
                        column: x => x.LeaveSetupId,
                        principalTable: "GuildLeaveSetup",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildLevel",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Xp = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    CurrentLevel = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    ClaimedXpDrops = table.Column<string[]>(type: "text[]", nullable: true),
                    CurrentStreakDay = table.Column<int>(type: "integer", nullable: true),
                    RequiredXp = table.Column<string>(type: "text", nullable: true),
                    LastXpStreakUpdate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LevelSettingsId = table.Column<int>(type: "integer", nullable: false),
                    UserId1 = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildLevel", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildLevel_GuildLevelSettings_LevelSettingsId",
                        column: x => x.LevelSettingsId,
                        principalTable: "GuildLevelSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GuildLevel_Users_UserId1",
                        column: x => x.UserId1,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildXpDrops",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    XpRange = table.Column<string>(type: "text", nullable: true),
                    TimeToRespawn = table.Column<int>(type: "integer", nullable: false),
                    ChannelIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    ClaimAmount = table.Column<int>(type: "integer", nullable: false),
                    ExpireTime = table.Column<int>(type: "integer", nullable: false),
                    MessageIdsToDelete = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    LastSpawned = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LevelSettingsId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildXpDrops", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildXpDrops_GuildLevelSettings_LevelSettingsId",
                        column: x => x.LevelSettingsId,
                        principalTable: "GuildLevelSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildXpStreaks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Day = table.Column<int>(type: "integer", nullable: false),
                    Nickname = table.Column<string>(type: "text", nullable: true),
                    BonusLevels = table.Column<int>(type: "integer", nullable: true),
                    BonusXp = table.Column<int>(type: "integer", nullable: true),
                    Multiplier = table.Column<int>(type: "integer", nullable: true),
                    RoleRewardIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: true),
                    MessageTemplateId = table.Column<int>(type: "integer", nullable: true),
                    LevelSettingsId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildXpStreaks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildXpStreaks_GuildLevelSettings_LevelSettingsId",
                        column: x => x.LevelSettingsId,
                        principalTable: "GuildLevelSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GuildXpStreaks_GuildMessageTemplates_MessageTemplateId",
                        column: x => x.MessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "GuildPollOptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Label = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Emoji = table.Column<string>(type: "text", nullable: true),
                    UserIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    PollId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildPollOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildPollOptions_GuildPolls_PollId",
                        column: x => x.PollId,
                        principalTable: "GuildPolls",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildTempVoicePresets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChannelName = table.Column<string>(type: "text", nullable: true),
                    ChannelLimit = table.Column<int>(type: "integer", nullable: true),
                    ChannelRegion = table.Column<string>(type: "text", nullable: true),
                    ChannelBitRate = table.Column<int>(type: "integer", nullable: true),
                    UserInviteType = table.Column<int>(type: "integer", nullable: true),
                    SendLogsInTempChannel = table.Column<bool>(type: "boolean", nullable: false),
                    BlacklistRoleId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    ManageComponents = table.Column<string[]>(type: "text[]", nullable: false),
                    OwnerAllowedDiscordPermissions = table.Column<string[]>(type: "text[]", nullable: false),
                    OwnerDeniedDiscordPermissions = table.Column<string[]>(type: "text[]", nullable: false),
                    TempVoiceSettingsId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildTempVoicePresets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildTempVoicePresets_GuildTempVoiceSettings_TempVoiceSetti~",
                        column: x => x.TempVoiceSettingsId,
                        principalTable: "GuildTempVoiceSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildTicketModalData",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Placeholder = table.Column<string>(type: "text", nullable: true),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    MinLength = table.Column<int>(type: "integer", nullable: true),
                    MaxLength = table.Column<int>(type: "integer", nullable: true),
                    Required = table.Column<bool>(type: "boolean", nullable: false),
                    TicketSetupId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildTicketModalData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildTicketModalData_GuildTicketSetups_TicketSetupId",
                        column: x => x.TicketSetupId,
                        principalTable: "GuildTicketSetups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildTicketPermissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DiscordUserId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    DiscordRoleId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    HasShadowPing = table.Column<bool>(type: "boolean", nullable: false),
                    IsHandler = table.Column<bool>(type: "boolean", nullable: false),
                    Permissions = table.Column<string[]>(type: "text[]", nullable: true),
                    AllowedDiscordPermissions = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    DeniedDiscordPermissions = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    TicketSetupId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildTicketPermissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildTicketPermissions_GuildTicketSetups_TicketSetupId",
                        column: x => x.TicketSetupId,
                        principalTable: "GuildTicketSetups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildTickets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IsClosed = table.Column<bool>(type: "boolean", nullable: false),
                    ChannelType = table.Column<int>(type: "integer", nullable: false),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    ThreadId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    LastCreatedMessageIdInTicket = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    IsClaimed = table.Column<bool>(type: "boolean", nullable: false),
                    IsArchived = table.Column<bool>(type: "boolean", nullable: false),
                    ArchiveMessageId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    UserWhoHasClaimedId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    IsLocked = table.Column<bool>(type: "boolean", nullable: false),
                    TicketOwnerId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    AddedMemberIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: true),
                    TranscriptChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    TranscriptHtml = table.Column<string>(type: "text", nullable: true),
                    TranscriptJson = table.Column<string>(type: "text", nullable: true),
                    TicketNotes = table.Column<string[]>(type: "text[]", nullable: false),
                    SendTranscriptToUser = table.Column<bool>(type: "boolean", nullable: true),
                    OldTicketCategoryId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    AutoCloseAction = table.Column<int[]>(type: "integer[]", nullable: false),
                    CloseActionReason = table.Column<string>(type: "text", nullable: true),
                    AutoAssignHandler = table.Column<bool>(type: "boolean", nullable: false),
                    TicketFeedbackChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    WithTicketFeedback = table.Column<bool>(type: "boolean", nullable: false),
                    OnlyClaimMode = table.Column<bool>(type: "boolean", nullable: false),
                    IsAutoDone = table.Column<bool>(type: "boolean", nullable: false),
                    AutoReplyMessageTemplateIdId = table.Column<int>(type: "integer", nullable: true),
                    UserDmWhenCloseMessageTemplateIdId = table.Column<int>(type: "integer", nullable: true),
                    ClosedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    TicketSetupId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildTickets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildTickets_GuildMessageTemplates_AutoReplyMessageTemplate~",
                        column: x => x.AutoReplyMessageTemplateIdId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildTickets_GuildMessageTemplates_UserDmWhenCloseMessageTe~",
                        column: x => x.UserDmWhenCloseMessageTemplateIdId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildTickets_GuildTicketSetups_TicketSetupId",
                        column: x => x.TicketSetupId,
                        principalTable: "GuildTicketSetups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildWelcomeImageData",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: false),
                    Subtitle = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: false),
                    Background = table.Column<string>(type: "text", nullable: true),
                    Theme = table.Column<string>(type: "text", nullable: true),
                    Gradient = table.Column<string>(type: "text", nullable: true),
                    WelcomeSetupId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildWelcomeImageData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildWelcomeImageData_GuildWelcomeSetups_WelcomeSetupId",
                        column: x => x.WelcomeSetupId,
                        principalTable: "GuildWelcomeSetups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildModerationScoutForms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CustomId = table.Column<string>(type: "text", nullable: false),
                    Actions = table.Column<string>(type: "jsonb", nullable: false),
                    ModerationScoutId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildModerationScoutForms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildModerationScoutForms_GuildModerationScout_ModerationSc~",
                        column: x => x.ModerationScoutId,
                        principalTable: "GuildModerationScout",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildModerationScoutReports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ReporterId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    UserId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    Placeholder = table.Column<string>(type: "text", nullable: true),
                    MinLength = table.Column<int>(type: "integer", nullable: false),
                    MaxLength = table.Column<int>(type: "integer", nullable: false),
                    Required = table.Column<bool>(type: "boolean", nullable: false),
                    Data = table.Column<string>(type: "jsonb", nullable: false),
                    InteractionType = table.Column<int>(type: "integer", nullable: false),
                    ModerationScoutId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildModerationScoutReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildModerationScoutReports_GuildModerationScout_Moderation~",
                        column: x => x.ModerationScoutId,
                        principalTable: "GuildModerationScout",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildVerificationGatesPermissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    Permissions = table.Column<string[]>(type: "text[]", nullable: false),
                    VerificationGateId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildVerificationGatesPermissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildVerificationGatesPermissions_GuildVerificationGates_Ve~",
                        column: x => x.VerificationGateId,
                        principalTable: "GuildVerificationGates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserGuildVanityAnalyticsLatest30Day",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Clicks = table.Column<int>(type: "integer", nullable: true),
                    UniqueClicks = table.Column<int>(type: "integer", nullable: true),
                    JoinedWithCode = table.Column<int>(type: "integer", nullable: true),
                    GuildVanityAnalyticsId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGuildVanityAnalyticsLatest30Day", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserGuildVanityAnalyticsLatest30Day_UserGuildVanityAnalytic~",
                        column: x => x.GuildVanityAnalyticsId,
                        principalTable: "UserGuildVanityAnalytic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserGuildVanityEmbedAuthor",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Url = table.Column<string>(type: "text", nullable: true),
                    IconUrl = table.Column<string>(type: "text", nullable: true),
                    GuildVanityEmbedId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGuildVanityEmbedAuthor", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserGuildVanityEmbedAuthor_UserGuildVanityEmbed_GuildVanity~",
                        column: x => x.GuildVanityEmbedId,
                        principalTable: "UserGuildVanityEmbed",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildPollAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: true),
                    PollId = table.Column<int>(type: "integer", nullable: false),
                    PollOptionId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildPollAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildPollAnswers_GuildPollOptions_PollOptionId",
                        column: x => x.PollOptionId,
                        principalTable: "GuildPollOptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GuildPollAnswers_GuildPolls_PollId",
                        column: x => x.PollId,
                        principalTable: "GuildPolls",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildTempVoiceConfigs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreatorChannel = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    ChannelCategory = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    IsManageEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    ManageMessageTemplateId = table.Column<int>(type: "integer", nullable: true),
                    TempVoicePresetId = table.Column<int>(type: "integer", nullable: true),
                    TempVoiceSettingsId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildTempVoiceConfigs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildTempVoiceConfigs_GuildMessageTemplates_ManageMessageTe~",
                        column: x => x.ManageMessageTemplateId,
                        principalTable: "GuildMessageTemplates",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildTempVoiceConfigs_GuildTempVoicePresets_TempVoicePreset~",
                        column: x => x.TempVoicePresetId,
                        principalTable: "GuildTempVoicePresets",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildTempVoiceConfigs_GuildTempVoiceSettings_TempVoiceSetti~",
                        column: x => x.TempVoiceSettingsId,
                        principalTable: "GuildTempVoiceSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildTempVoicePresetDiscordRolePermissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    AllowedDiscordPermissions = table.Column<string[]>(type: "text[]", nullable: false),
                    DeniedDiscordPermissions = table.Column<string[]>(type: "text[]", nullable: false),
                    TempVoicePresetId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildTempVoicePresetDiscordRolePermissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildTempVoicePresetDiscordRolePermissions_GuildTempVoicePr~",
                        column: x => x.TempVoicePresetId,
                        principalTable: "GuildTempVoicePresets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildTicketFeedback",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    Comment = table.Column<string>(type: "text", nullable: true),
                    Sent = table.Column<bool>(type: "boolean", nullable: false),
                    SubmittedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    TicketId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildTicketFeedback", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildTicketFeedback_GuildTickets_TicketId",
                        column: x => x.TicketId,
                        principalTable: "GuildTickets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildModerationScoutCases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    ModeratorId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    MessageId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    Data = table.Column<string>(type: "jsonb", nullable: false),
                    ModerationScoutReportId = table.Column<int>(type: "integer", nullable: true),
                    ModerationScoutId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildModerationScoutCases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildModerationScoutCases_GuildModerationScoutReports_Moder~",
                        column: x => x.ModerationScoutReportId,
                        principalTable: "GuildModerationScoutReports",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildModerationScoutCases_GuildModerationScout_ModerationSc~",
                        column: x => x.ModerationScoutId,
                        principalTable: "GuildModerationScout",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildTempVoiceChannels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChannelId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    OwnerId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    TempVoiceConfigId = table.Column<int>(type: "integer", nullable: false),
                    GuildId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildTempVoiceChannels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildTempVoiceChannels_GuildTempVoiceConfigs_TempVoiceConfi~",
                        column: x => x.TempVoiceConfigId,
                        principalTable: "GuildTempVoiceConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GuildTempVoiceChannels_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildModerationScoutUserAppeals",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AppealToken = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    Data = table.Column<string>(type: "jsonb", nullable: true),
                    CreatedBy = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    LinkedModerationScoutFormId = table.Column<int>(type: "integer", nullable: false),
                    ModerationScoutCaseId = table.Column<int>(type: "integer", nullable: false),
                    ModerationScoutId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildModerationScoutUserAppeals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildModerationScoutUserAppeals_GuildModerationScoutCases_M~",
                        column: x => x.ModerationScoutCaseId,
                        principalTable: "GuildModerationScoutCases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GuildModerationScoutUserAppeals_GuildModerationScoutForms_L~",
                        column: x => x.LinkedModerationScoutFormId,
                        principalTable: "GuildModerationScoutForms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GuildModerationScoutUserAppeals_GuildModerationScout_Modera~",
                        column: x => x.ModerationScoutId,
                        principalTable: "GuildModerationScout",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildUserModerations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CaseId = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    UserIds = table.Column<decimal[]>(type: "numeric(20,0)[]", nullable: false),
                    ModeratorId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: true),
                    DmMessage = table.Column<string>(type: "text", nullable: true),
                    Notes = table.Column<string[]>(type: "text[]", nullable: false),
                    CustomData = table.Column<string>(type: "jsonb", nullable: true),
                    ModerationScoutCasesId = table.Column<int>(type: "integer", nullable: false),
                    ModerationId = table.Column<int>(type: "integer", nullable: false),
                    GuildModerationScoutEntityId = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildUserModerations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildUserModerations_GuildModerationScoutCases_ModerationSc~",
                        column: x => x.ModerationScoutCasesId,
                        principalTable: "GuildModerationScoutCases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GuildUserModerations_GuildModerationScout_GuildModerationSc~",
                        column: x => x.GuildModerationScoutEntityId,
                        principalTable: "GuildModerationScout",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildUserModerations_GuildModeration_ModerationId",
                        column: x => x.ModerationId,
                        principalTable: "GuildModeration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuildTempVoiceChannelMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    Permissions = table.Column<string[]>(type: "text[]", nullable: false),
                    TempVoiceChannelId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildTempVoiceChannelMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildTempVoiceChannelMembers_GuildTempVoiceChannels_TempVoi~",
                        column: x => x.TempVoiceChannelId,
                        principalTable: "GuildTempVoiceChannels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GuildAutoDeletes_GuildId",
                table: "GuildAutoDeletes",
                column: "GuildId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildAutoModerations_ModerationId",
                table: "GuildAutoModerations",
                column: "ModerationId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildAutoPublishes_GuildId",
                table: "GuildAutoPublishes",
                column: "GuildId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildAutoReacts_GuildId",
                table: "GuildAutoReacts",
                column: "GuildId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildAutoRoles_GuildId",
                table: "GuildAutoRoles",
                column: "GuildId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildBanModerationSettings_ModerationId",
                table: "GuildBanModerationSettings",
                column: "ModerationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildBuildInCommands_GuildCommandMangerId",
                table: "GuildBuildInCommands",
                column: "GuildCommandMangerId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildChannelLinks_GuildId",
                table: "GuildChannelLinks",
                column: "GuildId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildCommandManger_InteractionManagerId",
                table: "GuildCommandManger",
                column: "InteractionManagerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildComponentManager_GuildInteractionManagerId",
                table: "GuildComponentManager",
                column: "GuildInteractionManagerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildDiscordGuildAddon_GuildId",
                table: "GuildDiscordGuildAddon",
                column: "GuildId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildGiveaways_EndedMessageTemplateId",
                table: "GuildGiveaways",
                column: "EndedMessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildGiveaways_GuildId",
                table: "GuildGiveaways",
                column: "GuildId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildGiveaways_MessageTemplateId",
                table: "GuildGiveaways",
                column: "MessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildGiveaways_WinnerMessageTemplateId",
                table: "GuildGiveaways",
                column: "WinnerMessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildInteractionManager_GuildId",
                table: "GuildInteractionManager",
                column: "GuildId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildInteractionPermissions_GuildId",
                table: "GuildInteractionPermissions",
                column: "GuildId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildKickModerationSettings_ModerationId",
                table: "GuildKickModerationSettings",
                column: "ModerationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildLeaveImageData_LeaveSetupId",
                table: "GuildLeaveImageData",
                column: "LeaveSetupId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildLeaveSetup_GuildId",
                table: "GuildLeaveSetup",
                column: "GuildId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildLeaveSetup_GuildMessageTemplateId",
                table: "GuildLeaveSetup",
                column: "GuildMessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildLevel_LevelSettingsId",
                table: "GuildLevel",
                column: "LevelSettingsId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildLevel_UserId1",
                table: "GuildLevel",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_GuildLevelSettings_GuildId",
                table: "GuildLevelSettings",
                column: "GuildId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildLevelSettings_LeaderboardMessageTemplateId",
                table: "GuildLevelSettings",
                column: "LeaderboardMessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildLevelSettings_LevelUpMessageTemplateId",
                table: "GuildLevelSettings",
                column: "LevelUpMessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildLevelSettings_LevelUserInfoMessageTemplateId",
                table: "GuildLevelSettings",
                column: "LevelUserInfoMessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildLevelSettings_XpDropsMessageTemplateId",
                table: "GuildLevelSettings",
                column: "XpDropsMessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildLogging_GuildId",
                table: "GuildLogging",
                column: "GuildId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildLogs_GuildId",
                table: "GuildLogs",
                column: "GuildId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildMessageTemplates_GuildId",
                table: "GuildMessageTemplates",
                column: "GuildId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildModeration_GuildId",
                table: "GuildModeration",
                column: "GuildId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildModerationScout_ModerationId",
                table: "GuildModerationScout",
                column: "ModerationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildModerationScout_SuccessReportMessageIdId",
                table: "GuildModerationScout",
                column: "SuccessReportMessageIdId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildModerationScoutCases_ModerationScoutId",
                table: "GuildModerationScoutCases",
                column: "ModerationScoutId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildModerationScoutCases_ModerationScoutReportId",
                table: "GuildModerationScoutCases",
                column: "ModerationScoutReportId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildModerationScoutForms_ModerationScoutId",
                table: "GuildModerationScoutForms",
                column: "ModerationScoutId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildModerationScoutReports_ModerationScoutId",
                table: "GuildModerationScoutReports",
                column: "ModerationScoutId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildModerationScoutUserAppeals_LinkedModerationScoutFormId",
                table: "GuildModerationScoutUserAppeals",
                column: "LinkedModerationScoutFormId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildModerationScoutUserAppeals_ModerationScoutCaseId",
                table: "GuildModerationScoutUserAppeals",
                column: "ModerationScoutCaseId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildModerationScoutUserAppeals_ModerationScoutId",
                table: "GuildModerationScoutUserAppeals",
                column: "ModerationScoutId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildMuteModerationSettings_ModerationId",
                table: "GuildMuteModerationSettings",
                column: "ModerationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildPollAnswers_PollId",
                table: "GuildPollAnswers",
                column: "PollId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildPollAnswers_PollOptionId",
                table: "GuildPollAnswers",
                column: "PollOptionId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildPollOptions_PollId",
                table: "GuildPollOptions",
                column: "PollId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildPolls_GuildId",
                table: "GuildPolls",
                column: "GuildId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildPolls_MessageTemplatesId",
                table: "GuildPolls",
                column: "MessageTemplatesId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildSecurity_GuildId",
                table: "GuildSecurity",
                column: "GuildId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildSpotifyNotifications_GuildId",
                table: "GuildSpotifyNotifications",
                column: "GuildId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildSpotifyNotifications_MessageTemplateId",
                table: "GuildSpotifyNotifications",
                column: "MessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildSyncedChannelLinkMessages_ChannelLinksId",
                table: "GuildSyncedChannelLinkMessages",
                column: "ChannelLinksId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTempVoiceChannelMembers_TempVoiceChannelId",
                table: "GuildTempVoiceChannelMembers",
                column: "TempVoiceChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTempVoiceChannels_GuildId",
                table: "GuildTempVoiceChannels",
                column: "GuildId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTempVoiceChannels_TempVoiceConfigId",
                table: "GuildTempVoiceChannels",
                column: "TempVoiceConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTempVoiceConfigs_ManageMessageTemplateId",
                table: "GuildTempVoiceConfigs",
                column: "ManageMessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTempVoiceConfigs_TempVoicePresetId",
                table: "GuildTempVoiceConfigs",
                column: "TempVoicePresetId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTempVoiceConfigs_TempVoiceSettingsId",
                table: "GuildTempVoiceConfigs",
                column: "TempVoiceSettingsId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTempVoicePresetDiscordRolePermissions_TempVoicePresetId",
                table: "GuildTempVoicePresetDiscordRolePermissions",
                column: "TempVoicePresetId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTempVoicePresets_TempVoiceSettingsId",
                table: "GuildTempVoicePresets",
                column: "TempVoiceSettingsId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTempVoiceSettings_GuildId",
                table: "GuildTempVoiceSettings",
                column: "GuildId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildTempVoiceSettings_UserInviteMessageTemplateId",
                table: "GuildTempVoiceSettings",
                column: "UserInviteMessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTicketFeedback_TicketId",
                table: "GuildTicketFeedback",
                column: "TicketId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildTicketModalData_TicketSetupId",
                table: "GuildTicketModalData",
                column: "TicketSetupId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTicketPermissions_TicketSetupId",
                table: "GuildTicketPermissions",
                column: "TicketSetupId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTickets_AutoReplyMessageTemplateIdId",
                table: "GuildTickets",
                column: "AutoReplyMessageTemplateIdId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTickets_TicketSetupId",
                table: "GuildTickets",
                column: "TicketSetupId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTickets_UserDmWhenCloseMessageTemplateIdId",
                table: "GuildTickets",
                column: "UserDmWhenCloseMessageTemplateIdId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTicketSetups_AutoReplyMessageTemplateIdId",
                table: "GuildTicketSetups",
                column: "AutoReplyMessageTemplateIdId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTicketSetups_GuildId",
                table: "GuildTicketSetups",
                column: "GuildId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTicketSetups_TicketStatusMessageIdId",
                table: "GuildTicketSetups",
                column: "TicketStatusMessageIdId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTicketSetups_TicketStatusMessageTemplateIdId",
                table: "GuildTicketSetups",
                column: "TicketStatusMessageTemplateIdId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTicketSetups_UserDmWhenCloseMessageTemplateIdId",
                table: "GuildTicketSetups",
                column: "UserDmWhenCloseMessageTemplateIdId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTwitchNotifications_GuildsId",
                table: "GuildTwitchNotifications",
                column: "GuildsId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildTwitchNotifications_MessageTemplateId",
                table: "GuildTwitchNotifications",
                column: "MessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildUnbanModerationSettings_ModerationId",
                table: "GuildUnbanModerationSettings",
                column: "ModerationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildUnmuteModerationSettings_ModerationId",
                table: "GuildUnmuteModerationSettings",
                column: "ModerationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildUnwarnModerationSettings_ModerationId",
                table: "GuildUnwarnModerationSettings",
                column: "ModerationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildUserModerations_GuildModerationScoutEntityId",
                table: "GuildUserModerations",
                column: "GuildModerationScoutEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildUserModerations_ModerationId",
                table: "GuildUserModerations",
                column: "ModerationId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildUserModerations_ModerationScoutCasesId",
                table: "GuildUserModerations",
                column: "ModerationScoutCasesId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildVerificationGates_SecurityId",
                table: "GuildVerificationGates",
                column: "SecurityId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildVerificationGatesPermissions_VerificationGateId",
                table: "GuildVerificationGatesPermissions",
                column: "VerificationGateId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildWarnModerationSettings_ModerationId",
                table: "GuildWarnModerationSettings",
                column: "ModerationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildWelcomeImageData_WelcomeSetupId",
                table: "GuildWelcomeImageData",
                column: "WelcomeSetupId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildWelcomeSetups_GuildId",
                table: "GuildWelcomeSetups",
                column: "GuildId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildWelcomeSetups_MessageTemplateId",
                table: "GuildWelcomeSetups",
                column: "MessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildXpDrops_LevelSettingsId",
                table: "GuildXpDrops",
                column: "LevelSettingsId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildXpStreaks_LevelSettingsId",
                table: "GuildXpStreaks",
                column: "LevelSettingsId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildXpStreaks_MessageTemplateId",
                table: "GuildXpStreaks",
                column: "MessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildYoutubeNotifications_GuildId",
                table: "GuildYoutubeNotifications",
                column: "GuildId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildYoutubeNotifications_MessageTemplateId",
                table: "GuildYoutubeNotifications",
                column: "MessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_UserApis_UserId",
                table: "UserApis",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserGuildBackups_UserId",
                table: "UserGuildBackups",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserGuildVanities_UserId",
                table: "UserGuildVanities",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserGuildVanityAnalytic_GuildVanityId",
                table: "UserGuildVanityAnalytic",
                column: "GuildVanityId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserGuildVanityAnalytic_TrackMessageTemplateId",
                table: "UserGuildVanityAnalytic",
                column: "TrackMessageTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_UserGuildVanityAnalyticsLatest30Day_GuildVanityAnalyticsId",
                table: "UserGuildVanityAnalyticsLatest30Day",
                column: "GuildVanityAnalyticsId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserGuildVanityEmbed_GuildVanityId",
                table: "UserGuildVanityEmbed",
                column: "GuildVanityId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserGuildVanityEmbedAuthor_GuildVanityEmbedId",
                table: "UserGuildVanityEmbedAuthor",
                column: "GuildVanityEmbedId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GuildAutoDeletes");

            migrationBuilder.DropTable(
                name: "GuildAutoModerations");

            migrationBuilder.DropTable(
                name: "GuildAutoPublishes");

            migrationBuilder.DropTable(
                name: "GuildAutoReacts");

            migrationBuilder.DropTable(
                name: "GuildAutoRoles");

            migrationBuilder.DropTable(
                name: "GuildBanModerationSettings");

            migrationBuilder.DropTable(
                name: "GuildBuildInCommands");

            migrationBuilder.DropTable(
                name: "GuildComponentManager");

            migrationBuilder.DropTable(
                name: "GuildDiscordGuildAddon");

            migrationBuilder.DropTable(
                name: "GuildGiveaways");

            migrationBuilder.DropTable(
                name: "GuildInteractionPermissions");

            migrationBuilder.DropTable(
                name: "GuildKickModerationSettings");

            migrationBuilder.DropTable(
                name: "GuildLeaveImageData");

            migrationBuilder.DropTable(
                name: "GuildLevel");

            migrationBuilder.DropTable(
                name: "GuildLogging");

            migrationBuilder.DropTable(
                name: "GuildLogs");

            migrationBuilder.DropTable(
                name: "GuildModerationScoutUserAppeals");

            migrationBuilder.DropTable(
                name: "GuildMuteModerationSettings");

            migrationBuilder.DropTable(
                name: "GuildPollAnswers");

            migrationBuilder.DropTable(
                name: "GuildSpotifyNotifications");

            migrationBuilder.DropTable(
                name: "GuildSyncedChannelLinkMessages");

            migrationBuilder.DropTable(
                name: "GuildTempVoiceChannelMembers");

            migrationBuilder.DropTable(
                name: "GuildTempVoicePresetDiscordRolePermissions");

            migrationBuilder.DropTable(
                name: "GuildTicketFeedback");

            migrationBuilder.DropTable(
                name: "GuildTicketModalData");

            migrationBuilder.DropTable(
                name: "GuildTicketPermissions");

            migrationBuilder.DropTable(
                name: "GuildTwitchNotifications");

            migrationBuilder.DropTable(
                name: "GuildUnbanModerationSettings");

            migrationBuilder.DropTable(
                name: "GuildUnmuteModerationSettings");

            migrationBuilder.DropTable(
                name: "GuildUnwarnModerationSettings");

            migrationBuilder.DropTable(
                name: "GuildUserModerations");

            migrationBuilder.DropTable(
                name: "GuildVerificationGatesPermissions");

            migrationBuilder.DropTable(
                name: "GuildWarnModerationSettings");

            migrationBuilder.DropTable(
                name: "GuildWelcomeImageData");

            migrationBuilder.DropTable(
                name: "GuildXpDrops");

            migrationBuilder.DropTable(
                name: "GuildXpStreaks");

            migrationBuilder.DropTable(
                name: "GuildYoutubeNotifications");

            migrationBuilder.DropTable(
                name: "UserApis");

            migrationBuilder.DropTable(
                name: "UserGuildBackups");

            migrationBuilder.DropTable(
                name: "UserGuildVanityAnalyticsLatest30Day");

            migrationBuilder.DropTable(
                name: "UserGuildVanityEmbedAuthor");

            migrationBuilder.DropTable(
                name: "GuildCommandManger");

            migrationBuilder.DropTable(
                name: "GuildLeaveSetup");

            migrationBuilder.DropTable(
                name: "GuildModerationScoutForms");

            migrationBuilder.DropTable(
                name: "GuildPollOptions");

            migrationBuilder.DropTable(
                name: "GuildChannelLinks");

            migrationBuilder.DropTable(
                name: "GuildTempVoiceChannels");

            migrationBuilder.DropTable(
                name: "GuildTickets");

            migrationBuilder.DropTable(
                name: "GuildModerationScoutCases");

            migrationBuilder.DropTable(
                name: "GuildVerificationGates");

            migrationBuilder.DropTable(
                name: "GuildWelcomeSetups");

            migrationBuilder.DropTable(
                name: "GuildLevelSettings");

            migrationBuilder.DropTable(
                name: "UserGuildVanityAnalytic");

            migrationBuilder.DropTable(
                name: "UserGuildVanityEmbed");

            migrationBuilder.DropTable(
                name: "GuildInteractionManager");

            migrationBuilder.DropTable(
                name: "GuildPolls");

            migrationBuilder.DropTable(
                name: "GuildTempVoiceConfigs");

            migrationBuilder.DropTable(
                name: "GuildTicketSetups");

            migrationBuilder.DropTable(
                name: "GuildModerationScoutReports");

            migrationBuilder.DropTable(
                name: "GuildSecurity");

            migrationBuilder.DropTable(
                name: "UserGuildVanities");

            migrationBuilder.DropTable(
                name: "GuildTempVoicePresets");

            migrationBuilder.DropTable(
                name: "GuildModerationScout");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "GuildTempVoiceSettings");

            migrationBuilder.DropTable(
                name: "GuildModeration");

            migrationBuilder.DropTable(
                name: "GuildMessageTemplates");

            migrationBuilder.DropTable(
                name: "Guilds");
        }
    }
}
