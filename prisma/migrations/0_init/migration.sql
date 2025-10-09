-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."Guilds" (
    "Id" SERIAL NOT NULL,
    "GuildId" TEXT NOT NULL,
    "GuildName" TEXT NOT NULL,
    "GuildOwner" TEXT NOT NULL,

    CONSTRAINT "Guilds_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildCommandManger" (
    "Id" SERIAL NOT NULL,
    "Commands" JSONB[],
    "SubCommands" JSONB[],
    "SubCommandGroups" JSONB[],
    "ContextMenus" JSONB[],
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildCommandManger_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."BuildInCommands" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "CustomName" TEXT NOT NULL,
    "Description" TEXT,
    "Permissions" TEXT,
    "IsEnabled" BOOLEAN DEFAULT false,
    "CodeName" TEXT NOT NULL,
    "GuildCommandMangerId" TEXT NOT NULL,

    CONSTRAINT "BuildInCommands_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildComponentManager" (
    "Id" SERIAL NOT NULL,
    "Selectmenus" JSONB[],
    "Buttons" JSONB[],
    "Modals" JSONB[],
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildComponentManager_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildInteractionPermissions" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "RoleIds" TEXT[],
    "UserIds" TEXT[],
    "ChannelIds" TEXT[],
    "CustomId" TEXT,
    "CommandName" TEXT,
    "Type" TEXT NOT NULL,
    "DisableInternalUserPermission" BOOLEAN DEFAULT false,
    "NeedsGuildOwner" BOOLEAN,
    "Cooldown" INTEGER,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildInteractionPermissions_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildAutoDeletes" (
    "Id" SERIAL NOT NULL,
    "ChannelId" TEXT,
    "IsActive" BOOLEAN,
    "Time" TEXT,
    "UUID" TEXT,
    "WhitelistedMessages" TEXT[],
    "WhitelistedRoles" TEXT[],
    "WhitelistedUsers" TEXT[],
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildAutoDeletes_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildAutoPublish" (
    "Id" SERIAL NOT NULL,
    "Channels" TEXT[],
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildAutoPublish_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildAutoReacts" (
    "Id" SERIAL NOT NULL,
    "ChannelId" TEXT NOT NULL,
    "Emoji" TEXT NOT NULL,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildAutoReacts_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildAutoRoles" (
    "Id" SERIAL NOT NULL,
    "RoleId" TEXT NOT NULL,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildAutoRoles_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."ModerationScout" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "PublicBanListUrl" TEXT DEFAULT 'https://api.disbot.app/v2/banList',
    "AdminBanList" JSONB NOT NULL,
    "CurrentUserModerations" JSONB[],
    "PublicBanListEnabled" BOOLEAN NOT NULL DEFAULT false,
    "NeedsModeratorApprove" BOOLEAN NOT NULL,
    "ModeratorRoles" TEXT[],
    "ReportCommandId" TEXT NOT NULL,
    "ReportMesageContextId" TEXT NOT NULL,
    "ReportUserContextId" TEXT NOT NULL,
    "ImmuneReportRoles" TEXT[],
    "NotAllowedToReportRoles" TEXT[],
    "SuccssReportMessageId" TEXT NOT NULL,
    "ReportActions" TEXT[],
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "ModerationScout_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."ModerationScoutCases" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "MessageId" TEXT NOT NULL,
    "Channelid" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "ModeratorId" TEXT NOT NULL,
    "Data" JSONB NOT NULL,
    "ModerationScoutId" TEXT NOT NULL,

    CONSTRAINT "ModerationScoutCases_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."ModerationScoutForms" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "Sorting" TEXT[],
    "Actions" TEXT[],

    CONSTRAINT "ModerationScoutForms_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."ModerationScoutFormsData" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Label" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Placeholder" TEXT NOT NULL,
    "OptionData" JSONB NOT NULL,

    CONSTRAINT "ModerationScoutFormsData_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."ModerationScoutUserAppeals" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "Token" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "Case" TEXT NOT NULL,
    "FormId" TEXT NOT NULL,
    "ModerationScoutFormId" TEXT NOT NULL,
    "Data" JSONB NOT NULL,
    "CratedAt" TIMESTAMP(3) NOT NULL,
    "CreatedBy" TEXT NOT NULL,
    "ModerationScoutId" TEXT NOT NULL,

    CONSTRAINT "ModerationScoutUserAppeals_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."ModerationScoutReportModalData" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Placeholder" TEXT,
    "Type" INTEGER NOT NULL,
    "MinLength" INTEGER,
    "MaxLength" INTEGER,
    "Required" BOOLEAN NOT NULL,
    "InteractionType" TEXT NOT NULL,
    "ModerationScoutId" TEXT NOT NULL,

    CONSTRAINT "ModerationScoutReportModalData_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."ModerationScoutReports" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "SusUserId" TEXT NOT NULL,
    "Reason" TEXT,
    "Data" JSONB,
    "IsReportedToBanListAdmin" BOOLEAN NOT NULL,
    "ModeratorUserId" TEXT NOT NULL,

    CONSTRAINT "ModerationScoutReports_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildModeration" (
    "Id" SERIAL NOT NULL,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildModeration_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildUserModerationSettingBan" (
    "Id" SERIAL NOT NULL,
    "DefaultReason" TEXT NOT NULL,
    "AuditLogReason" TEXT NOT NULL,
    "Duration" INTEGER NOT NULL,
    "DeleteProveMessage" BOOLEAN NOT NULL,
    "NeedReason" BOOLEAN NOT NULL,
    "GuildUserModerationSettingId" TEXT NOT NULL,

    CONSTRAINT "GuildUserModerationSettingBan_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildUserModerationSettingUnban" (
    "Id" SERIAL NOT NULL,
    "DefaultReason" TEXT NOT NULL,
    "AuditLogReason" TEXT NOT NULL,
    "NeedReason" BOOLEAN NOT NULL,
    "GuildUserModerationSettingId" TEXT NOT NULL,

    CONSTRAINT "GuildUserModerationSettingUnban_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildUserModerationSettinKick" (
    "Id" SERIAL NOT NULL,
    "DefaultReason" TEXT NOT NULL,
    "AuditLogReason" TEXT NOT NULL,
    "NeedReason" BOOLEAN NOT NULL,
    "GuildUserModerationSettingId" TEXT NOT NULL,

    CONSTRAINT "GuildUserModerationSettinKick_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildUserModerationSettingWarn" (
    "Id" SERIAL NOT NULL,
    "DefaultReason" TEXT NOT NULL,
    "AuditLogReason" TEXT NOT NULL,
    "Duration" INTEGER NOT NULL,
    "Actions" JSONB[],
    "DeleteProveMessage" BOOLEAN NOT NULL,
    "NeedReason" BOOLEAN NOT NULL,
    "GuildUserModerationSettingId" TEXT NOT NULL,

    CONSTRAINT "GuildUserModerationSettingWarn_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildUserModerationSettingUnwarn" (
    "Id" SERIAL NOT NULL,
    "DefaultReason" TEXT NOT NULL,
    "AuditLogReason" TEXT NOT NULL,
    "Actions" JSONB[],
    "NeedReason" BOOLEAN NOT NULL,
    "GuildUserModerationSettingId" TEXT NOT NULL,

    CONSTRAINT "GuildUserModerationSettingUnwarn_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildUserModerationSettingMute" (
    "Id" SERIAL NOT NULL,
    "DefaultReason" TEXT NOT NULL,
    "AuditLogReason" TEXT NOT NULL,
    "Duration" INTEGER NOT NULL,
    "Actions" JSONB[],
    "DeleteProveMessage" BOOLEAN NOT NULL,
    "NeedReason" BOOLEAN NOT NULL,
    "UseTimeout" BOOLEAN NOT NULL,
    "GuildUserModerationSettingId" TEXT NOT NULL,

    CONSTRAINT "GuildUserModerationSettingMute_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildUserModerationSettingUnmute" (
    "Id" SERIAL NOT NULL,
    "DefaultReason" TEXT NOT NULL,
    "AuditLogReason" TEXT NOT NULL,
    "Actions" JSONB NOT NULL,
    "NeedReason" BOOLEAN NOT NULL,
    "GuildUserModerationSettingId" TEXT NOT NULL,

    CONSTRAINT "GuildUserModerationSettingUnmute_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildUserModeration" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "Duration" TEXT,
    "UserIds" TEXT[],
    "Reason" TEXT,
    "ModeratorId" TEXT,
    "DmMessage" TEXT,
    "Type" TEXT,
    "Notes" TEXT[],
    "LinkedCaseId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3),
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildUserModeration_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildDisBotAutoModeration" (
    "Id" SERIAL NOT NULL,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildDisBotAutoModeration_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildDisBotAutoModerationMessages" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "RegexPetterns" TEXT[],
    "ExcludedChannels" TEXT[],
    "ExcludedRoles" TEXT[],
    "Trigger" JSONB NOT NULL,
    "Actions" JSONB[],
    "GuildDisBotAutoModerationId" TEXT NOT NULL,

    CONSTRAINT "GuildDisBotAutoModerationMessages_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildDisBotAutoModerationMentions" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "RegexPetterns" TEXT[],
    "ExcludedChannels" TEXT[],
    "ExcludedRoles" TEXT[],
    "Trigger" JSONB NOT NULL,
    "Actions" JSONB[],
    "GuildDisBotAutoModerationId" TEXT NOT NULL,

    CONSTRAINT "GuildDisBotAutoModerationMentions_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildDisBotAutoModerationAttachments" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "RegexPetterns" TEXT[],
    "ExcludedChannels" TEXT[],
    "ExcludedRoles" TEXT[],
    "Trigger" JSONB NOT NULL,
    "Actions" JSONB[],
    "GuildDisBotAutoModerationId" TEXT NOT NULL,

    CONSTRAINT "GuildDisBotAutoModerationAttachments_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildDisBotAutoModerationEmojis" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "RegexPetterns" TEXT[],
    "ExcludedChannels" TEXT[],
    "ExcludedRoles" TEXT[],
    "Trigger" JSONB NOT NULL,
    "Actions" JSONB[],
    "GuildDisBotAutoModerationId" TEXT NOT NULL,

    CONSTRAINT "GuildDisBotAutoModerationEmojis_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildDisBotAutoModerationBlockedWords" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "RegexPetterns" TEXT[],
    "ExcludedChannels" TEXT[],
    "ExcludedRoles" TEXT[],
    "Trigger" JSONB NOT NULL,
    "Actions" JSONB[],
    "GuildDisBotAutoModerationId" TEXT NOT NULL,

    CONSTRAINT "GuildDisBotAutoModerationBlockedWords_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildDisBotAutoModerationBlockLinks" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "RegexPetterns" TEXT[],
    "ExcludedChannels" TEXT[],
    "ExcludedRoles" TEXT[],
    "ExcludedLinks" TEXT[],
    "Trigger" JSONB NOT NULL,
    "Actions" JSONB[],
    "GuildDisBotAutoModerationId" TEXT NOT NULL,

    CONSTRAINT "GuildDisBotAutoModerationBlockLinks_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildDisBotAutoModerationBlockInvites" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "RegexPetterns" TEXT[],
    "ExcludedChannels" TEXT[],
    "ExcludedRoles" TEXT[],
    "ExcludedGuildIds" TEXT[],
    "Trigger" JSONB NOT NULL,
    "Actions" JSONB[],
    "GuildDisBotAutoModerationId" TEXT NOT NULL,

    CONSTRAINT "GuildDisBotAutoModerationBlockInvites_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildChannelLinks" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "ChannelId" TEXT NOT NULL,
    "WebhookUrl" TEXT NOT NULL,
    "SyncFlags" TEXT[],
    "LinkedWith" TEXT[],
    "UsersCanSelectIds" TEXT[],
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildChannelLinks_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."SyncedChannelLinkMessages" (
    "Id" SERIAL NOT NULL,
    "GuildId" TEXT NOT NULL,
    "UserMessageId" TEXT NOT NULL,
    "WebhookMessageId" TEXT NOT NULL,
    "WebhookUrl" TEXT NOT NULL,
    "ChannelId" TEXT NOT NULL,
    "ChannelLinkId" TEXT NOT NULL,

    CONSTRAINT "SyncedChannelLinkMessages_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."DiscordGuildAddon" (
    "Id" SERIAL NOT NULL,
    "OnlyMedia" TEXT[],
    "NoLinkEmbeds" TEXT[],
    "InvitesPaused" BOOLEAN NOT NULL,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "DiscordGuildAddon_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."Giveaways" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "MessageId" TEXT NOT NULL,
    "ChannelId" TEXT,
    "Prize" TEXT NOT NULL,
    "Winners" INTEGER NOT NULL,
    "Time" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "Ended" BOOLEAN NOT NULL,
    "EndedAt" TIMESTAMP(3),
    "EndedBy" TEXT,
    "Paused" BOOLEAN NOT NULL,
    "EndedMessage" TEXT,
    "Rerolled" BOOLEAN NOT NULL,
    "WinnerIds" TEXT[],
    "WinnerMessageTemplate" TEXT,
    "HostedBy" TEXT NOT NULL,
    "MessageTemplate" TEXT,
    "Content" TEXT,
    "Entrys" TEXT[],
    "Requirements" TEXT[],
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "Giveaways_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."TempVoices" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "Name" TEXT,
    "JointoCreateChannel" TEXT NOT NULL,
    "JointoCreateCategory" TEXT NOT NULL,
    "Manage" BOOLEAN NOT NULL,
    "PresetLimit" INTEGER,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "TempVoices_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."TempVoiceChannels" (
    "Id" SERIAL NOT NULL,
    "GuildId" TEXT NOT NULL,
    "ChannelId" TEXT NOT NULL,
    "OwnerId" TEXT NOT NULL,
    "TempVoiceId" TEXT NOT NULL,

    CONSTRAINT "TempVoiceChannels_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildLeaveSetup" (
    "Id" SERIAL NOT NULL,
    "MessageTemplateId" TEXT,
    "ChannelId" TEXT NOT NULL,
    "Image" BOOLEAN,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildLeaveSetup_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."LeaveImageData" (
    "Id" SERIAL NOT NULL,
    "Title" TEXT NOT NULL,
    "Text" TEXT NOT NULL,
    "Subtitle" TEXT NOT NULL,
    "Background" TEXT NOT NULL,
    "Theme" TEXT NOT NULL,
    "Color" TEXT NOT NULL,
    "Gradient" TEXT NOT NULL,
    "GuildLeaveSetupId" TEXT NOT NULL,

    CONSTRAINT "LeaveImageData_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildWelcomeSetup" (
    "Id" SERIAL NOT NULL,
    "MessageTemplateId" TEXT,
    "ChannelId" TEXT NOT NULL,
    "Image" BOOLEAN NOT NULL,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildWelcomeSetup_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."WelcomeImageData" (
    "Id" SERIAL NOT NULL,
    "Title" TEXT NOT NULL,
    "Text" TEXT NOT NULL,
    "Subtitle" TEXT NOT NULL,
    "Background" TEXT NOT NULL,
    "Theme" TEXT NOT NULL,
    "Color" TEXT NOT NULL,
    "Gradient" TEXT NOT NULL,
    "GuildWelcomeSetupId" TEXT NOT NULL,

    CONSTRAINT "WelcomeImageData_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildLogging" (
    "Id" SERIAL NOT NULL,
    "AutoMod" TEXT,
    "Channel" TEXT,
    "Emoji" TEXT,
    "Guild" TEXT,
    "Integration" TEXT,
    "Invite" TEXT,
    "Member" TEXT,
    "Message" TEXT,
    "Moderation" TEXT,
    "Reaction" TEXT,
    "Role" TEXT,
    "SoundBoard" TEXT,
    "Sticker" TEXT,
    "Thread" TEXT,
    "Voice" TEXT,
    "Webhook" TEXT,
    "Ban" TEXT,
    "Kick" TEXT,
    "Poll" TEXT,
    "Stage" TEXT,
    "Event" TEXT,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildLogging_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildLogs" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "Notes" TEXT[],
    "LogMessage" TEXT NOT NULL,
    "LogJSON" TEXT NOT NULL,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildLogs_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."MessageTemplates" (
    "Id" SERIAL NOT NULL,
    "Content" TEXT,
    "EmbedJSON" TEXT,
    "OtherEmbeds" TEXT[],
    "Name" TEXT NOT NULL,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "MessageTemplates_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildReactionRoles" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "Roles" TEXT[],
    "MessageId" TEXT,
    "ChannelId" TEXT,
    "AddMessage" TEXT,
    "RemoveMessage" TEXT,
    "Emoji" TEXT,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildReactionRoles_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."ReactionRoleSelectmenu" (
    "Id" SERIAL NOT NULL,
    "Emoji" TEXT,
    "Label" TEXT,
    "Description" TEXT,
    "GuildReactionRoleId" TEXT NOT NULL,

    CONSTRAINT "ReactionRoleSelectmenu_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."ReactionRoleButton" (
    "Id" SERIAL NOT NULL,
    "Emoji" TEXT,
    "Type" TEXT,
    "Label" TEXT,
    "GuildReactionRoleId" TEXT NOT NULL,

    CONSTRAINT "ReactionRoleButton_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildSecurity" (
    "Id" SERIAL NOT NULL,
    "InviteLoggingActive" TEXT,
    "MaxAccountAge" INTEGER,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildSecurity_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."VerificationGates" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "ChannelId" TEXT NOT NULL,
    "MessageId" TEXT NOT NULL,
    "Action" TEXT,
    "ActionType" TEXT,
    "Roles" TEXT[],
    "VerifiedUsers" TEXT[],
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "Active" BOOLEAN,
    "SecurityId" TEXT NOT NULL,

    CONSTRAINT "VerificationGates_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."VerificationGatesPermission" (
    "Id" SERIAL NOT NULL,
    "Permission" TEXT[],
    "ChannelId" TEXT NOT NULL,
    "VerificationGateId" TEXT NOT NULL,

    CONSTRAINT "VerificationGatesPermission_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildSpotifyNotifications" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "ShowId" TEXT NOT NULL,
    "ChannelId" TEXT NOT NULL,
    "Latests" TEXT[],
    "MessageTemplateId" TEXT NOT NULL,
    "PingRoles" TEXT[],
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildSpotifyNotifications_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."Tags" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "TagId" TEXT NOT NULL,
    "TriggerKeywords" TEXT[],
    "MessageTemplateId" TEXT,
    "IsShlashCommand" BOOLEAN NOT NULL,
    "ShlashCommandId" TEXT,
    "IsTextInputCommand" BOOLEAN NOT NULL,
    "IsEnabled" BOOLEAN NOT NULL,
    "PermissionRoleId" TEXT,
    "CommandDescription" TEXT,
    "FilterTextFromMessages" TEXT[],
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."Polls" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "MessageId" TEXT,
    "ChannelId" TEXT,
    "MessageTemplateId" TEXT NOT NULL,
    "MultiAnswers" INTEGER NOT NULL,
    "Time" INTEGER,
    "Entrys" TEXT[],
    "Type" INTEGER NOT NULL,
    "Requirements" TEXT[],
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "Polls_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."PollOptions" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "Label" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Emoji" TEXT,
    "UserIds" TEXT[],
    "PollId" TEXT NOT NULL,

    CONSTRAINT "PollOptions_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."PollAnswers" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "PollOptionId" TEXT NOT NULL,
    "PollId" TEXT NOT NULL,

    CONSTRAINT "PollAnswers_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."TicketSetups" (
    "Id" SERIAL NOT NULL,
    "CategoryId" TEXT,
    "ChannelType" INTEGER,
    "CustomId" TEXT NOT NULL,
    "TicketChannelName" TEXT,
    "EnableTicketsOnlyFromTime" TEXT,
    "MessageTemplateId" TEXT,
    "TicketBlacklistRoles" TEXT[],
    "TranscriptChannelId" TEXT,
    "HasModal" BOOLEAN,
    "ModalTitle" TEXT,
    "OnlyClaimMode" BOOLEAN,
    "TicketLimit" INTEGER,
    "UserDMWhenCloseMessageTemplateId" TEXT,
    "WithTicketFeedback" BOOLEAN,
    "TicketFeedbackChannelId" TEXT,
    "TicketCreationCooldownPerUser" INTEGER,
    "AutoCloseAfterInactivity" INTEGER,
    "AutoCloseAfterTime" INTEGER,
    "AutoAssignHandler" TEXT,
    "AutoReplyMessageTemplateId" TEXT,
    "TicketRateLimit" TEXT,
    "TicketStatusMessageTemplateId" TEXT,
    "TicketStatusMessageId" TEXT,
    "TicketStatusChannelId" TEXT,
    "AutoCloseAction" TEXT[],
    "OldTicketCategoryId" TEXT,
    "RequiredRoles" TEXT[],
    "SlashCommandId" TEXT,
    "SlashCommandName" TEXT,
    "SlashCommandDescription" TEXT,
    "TextCommandName" TEXT,
    "SendTranscriptToUser" BOOLEAN,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "TicketSetups_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."TicketModalData" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Placeholder" TEXT,
    "Type" INTEGER NOT NULL,
    "MinLength" INTEGER,
    "MaxLength" INTEGER,
    "Required" BOOLEAN NOT NULL,
    "TicketSetupId" TEXT NOT NULL,

    CONSTRAINT "TicketModalData_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."TicketPermissions" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "DiscordUserId" TEXT,
    "DiscordRoleId" TEXT,
    "HasShadowPing" BOOLEAN,
    "IsHandler" BOOLEAN NOT NULL DEFAULT false,
    "TicketPermissions" TEXT[],
    "AllowedDiscordPermissions" BIGINT,
    "DeniedDiscordPermissions" BIGINT,
    "TicketSetupId" TEXT NOT NULL,

    CONSTRAINT "TicketPermissions_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."Tickets" (
    "Id" SERIAL NOT NULL,
    "TicketId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "ClosedAt" TIMESTAMP(3),
    "IsClosed" BOOLEAN NOT NULL DEFAULT false,
    "GuildId" TEXT NOT NULL,
    "ChannelType" INTEGER NOT NULL,
    "ChannelId" TEXT,
    "ThreadId" TEXT,
    "LastMessageId" TEXT,
    "IsClaimed" BOOLEAN NOT NULL DEFAULT false,
    "IsArchived" BOOLEAN DEFAULT false,
    "ArchiveMessageId" TEXT,
    "UserWhoHasClaimedId" TEXT,
    "IsLocked" BOOLEAN,
    "TicketOwnerId" TEXT NOT NULL,
    "AddedMemberIds" TEXT[],
    "TranscriptChannelId" TEXT,
    "TranscriptHTML" TEXT,
    "TranscriptJSON" TEXT,
    "TicketNotes" TEXT[],
    "SendTranscriptToUser" BOOLEAN,
    "IsAutoDone" BOOLEAN DEFAULT false,
    "OldTicketCategoryId" TEXT,
    "AutoCloseAction" TEXT[],
    "CloseActionReason" TEXT,
    "AutoReplyMessageTemplateId" TEXT,
    "AutoAssignHandler" TEXT,
    "TicketFeedbackChannelId" TEXT,
    "WithTicketFeedback" BOOLEAN,
    "UserDMWhenCloseMessageTemplateId" TEXT,
    "OnlyClaimMode" BOOLEAN,
    "TicketSetupId" TEXT NOT NULL,

    CONSTRAINT "Tickets_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."TicketFeedback" (
    "Id" SERIAL NOT NULL,
    "TicketId" TEXT NOT NULL,
    "Rating" INTEGER,
    "Comment" TEXT,
    "Sent" BOOLEAN NOT NULL DEFAULT false,
    "SubmittedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketFeedback_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildFeatureToggles" (
    "Id" SERIAL NOT NULL,
    "LevelEnabled" BOOLEAN NOT NULL DEFAULT false,
    "WecomeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "LeaveEnabled" BOOLEAN NOT NULL DEFAULT false,
    "AutoreactEnabled" BOOLEAN NOT NULL DEFAULT false,
    "AutopublishEnabled" BOOLEAN NOT NULL DEFAULT false,
    "ChatfilterEnabled" BOOLEAN NOT NULL DEFAULT false,
    "AutorolesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "LoggingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "TwitchEnabled" BOOLEAN NOT NULL DEFAULT false,
    "YoutubeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "SpotifyEnabled" BOOLEAN NOT NULL DEFAULT false,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildFeatureToggles_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildTwitchNotifications" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "TwitchChannelName" TEXT NOT NULL,
    "ChannelId" TEXT NOT NULL,
    "Live" BOOLEAN NOT NULL,
    "MessageTemplateId" TEXT NOT NULL,
    "PingRoles" TEXT[],
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildTwitchNotifications_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildYoutubeNotifications" (
    "Id" SERIAL NOT NULL,
    "YoutubeChannelId" TEXT NOT NULL,
    "ChannelId" TEXT NOT NULL,
    "Latest" TEXT[],
    "MessageTemplateId" TEXT NOT NULL,
    "PingRoles" TEXT[],
    "UUID" TEXT NOT NULL,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "GuildYoutubeNotifications_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."LevelSettings" (
    "Id" SERIAL NOT NULL,
    "LevelUpChannelId" TEXT NOT NULL,
    "LevelUoMessageTemplateId" TEXT NOT NULL,
    "LeaderboardMessageTemplateId" TEXT NOT NULL,
    "LeaderboardDisplayAmount" INTEGER NOT NULL,
    "RequiredXPForFirstLevel" INTEGER NOT NULL,
    "Format" TEXT NOT NULL,
    "MessageXP" BOOLEAN NOT NULL,
    "MessageXPRange" TEXT NOT NULL,
    "MesssageXPCooldown" TEXT NOT NULL,
    "MessageXPType" TEXT NOT NULL,
    "VoiceXP" BOOLEAN NOT NULL,
    "VoiceXPRange" TEXT NOT NULL,
    "VoiceXPCooldown" INTEGER NOT NULL,
    "ExcludedChannelIds" TEXT[],
    "ExcludeUserIds" TEXT[],
    "ExcludeRoleIds" TEXT[],
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "LevelSettings_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."XPDrops" (
    "Id" SERIAL NOT NULL,
    "GuildId" TEXT NOT NULL,
    "XPRange" TEXT NOT NULL,
    "ClaimType" INTEGER NOT NULL,
    "TimeToRespawn" TEXT NOT NULL,
    "ChannelIds" TEXT[],

    CONSTRAINT "XPDrops_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."XPStreaks" (
    "Id" SERIAL NOT NULL,
    "Days" INTEGER NOT NULL,
    "Nickname" TEXT NOT NULL,
    "BonusLevels" INTEGER NOT NULL,
    "BonusXP" INTEGER NOT NULL,
    "ChannelId" TEXT NOT NULL,
    "MessageTemplateId" TEXT NOT NULL,
    "Multiplier" INTEGER NOT NULL,
    "RoleRewardIds" TEXT[],
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "XPStreaks_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."LevelRoles" (
    "Id" SERIAL NOT NULL,
    "Level" INTEGER NOT NULL,
    "Multiplier" INTEGER NOT NULL,
    "Type" TEXT NOT NULL,
    "RoleId" TEXT NOT NULL,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "LevelRoles_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."Levels" (
    "Id" SERIAL NOT NULL,
    "XP" INTEGER NOT NULL,
    "RequiredXp" INTEGER NOT NULL,
    "Level" INTEGER NOT NULL,
    "UserId" TEXT NOT NULL,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "Levels_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."Users" (
    "Id" SERIAL NOT NULL,
    "Username" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "Votes" INTEGER NOT NULL DEFAULT 0,
    "GloablVotes" INTEGER NOT NULL DEFAULT 0,
    "LastVote" TIMESTAMP(3),
    "CustomerBots" INTEGER NOT NULL DEFAULT 1,
    "BackupCount" INTEGER NOT NULL DEFAULT 10000,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."Apis" (
    "Id" SERIAL NOT NULL,
    "Flags" TEXT[],
    "AccessibleGuilds" TEXT[],
    "Key" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,

    CONSTRAINT "Apis_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."GuildBackups" (
    "Id" SERIAL NOT NULL,
    "BackupJSON" JSONB NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UUID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "GuildId" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,

    CONSTRAINT "GuildBackups_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."Vanitys" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "Slug" TEXT NOT NULL,
    "Host" TEXT NOT NULL,
    "GuildId" TEXT NOT NULL,
    "Invite" TEXT NOT NULL,
    "InDiscovery" BOOLEAN DEFAULT false,
    "IsBannedFromDiscover" BOOLEAN DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UserId" TEXT NOT NULL,

    CONSTRAINT "Vanitys_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."VanityEmbed" (
    "Id" SERIAL NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Color" TEXT NOT NULL,
    "ImageUrl" TEXT,
    "ThumbnailUrl" TEXT,
    "VanityId" TEXT NOT NULL,

    CONSTRAINT "VanityEmbed_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."VanityEmbedAuthor" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT,
    "URL" TEXT,
    "IconURL" TEXT,
    "VanityEmbedsId" TEXT NOT NULL,

    CONSTRAINT "VanityEmbedAuthor_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."VanityAnalytic" (
    "Id" SERIAL NOT NULL,
    "Click" INTEGER NOT NULL,
    "TrackInviteWithLog" TEXT,
    "TrackMessageId" TEXT,
    "Update" TIMESTAMP(3),
    "UniqueClick" INTEGER,
    "JoinedWithCode" INTEGER,
    "LoggedIPs" TEXT[],
    "VanityId" TEXT NOT NULL,

    CONSTRAINT "VanityAnalytic_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."VanityAnalyticsLatest30Day" (
    "Id" SERIAL NOT NULL,
    "Click" INTEGER,
    "UniqueClick" INTEGER,
    "Date" TIMESTAMP(3),
    "JoinedWithCode" INTEGER,
    "VanityAnalyticsId" TEXT NOT NULL,

    CONSTRAINT "VanityAnalyticsLatest30Day_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."DisBot" (
    "Id" SERIAL NOT NULL,
    "Logs" JSONB[],
    "SpotifyToken" TEXT NOT NULL,
    "TwitchToken" TEXT NOT NULL,
    "Version" TEXT NOT NULL,
    "GetConf" TEXT NOT NULL,

    CONSTRAINT "DisBot_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guilds_GuildId_key" ON "public"."Guilds"("GuildId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildCommandManger_GuildId_key" ON "public"."GuildCommandManger"("GuildId");

-- CreateIndex
CREATE UNIQUE INDEX "BuildInCommands_UUID_key" ON "public"."BuildInCommands"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "GuildComponentManager_GuildId_key" ON "public"."GuildComponentManager"("GuildId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildInteractionPermissions_UUID_key" ON "public"."GuildInteractionPermissions"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "GuildAutoDeletes_UUID_key" ON "public"."GuildAutoDeletes"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "GuildAutoPublish_GuildId_key" ON "public"."GuildAutoPublish"("GuildId");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationScout_UUID_key" ON "public"."ModerationScout"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationScout_GuildId_key" ON "public"."ModerationScout"("GuildId");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationScoutCases_UUID_key" ON "public"."ModerationScoutCases"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationScoutCases_ModerationScoutId_key" ON "public"."ModerationScoutCases"("ModerationScoutId");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationScoutForms_UUID_key" ON "public"."ModerationScoutForms"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationScoutFormsData_UUID_key" ON "public"."ModerationScoutFormsData"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationScoutUserAppeals_UUID_key" ON "public"."ModerationScoutUserAppeals"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationScoutReportModalData_UUID_key" ON "public"."ModerationScoutReportModalData"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationScoutReports_UUID_key" ON "public"."ModerationScoutReports"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "GuildModeration_GuildId_key" ON "public"."GuildModeration"("GuildId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildUserModerationSettingBan_GuildUserModerationSettingId_key" ON "public"."GuildUserModerationSettingBan"("GuildUserModerationSettingId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildUserModerationSettingUnban_GuildUserModerationSettingI_key" ON "public"."GuildUserModerationSettingUnban"("GuildUserModerationSettingId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildUserModerationSettinKick_GuildUserModerationSettingId_key" ON "public"."GuildUserModerationSettinKick"("GuildUserModerationSettingId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildUserModerationSettingWarn_GuildUserModerationSettingId_key" ON "public"."GuildUserModerationSettingWarn"("GuildUserModerationSettingId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildUserModerationSettingUnwarn_GuildUserModerationSetting_key" ON "public"."GuildUserModerationSettingUnwarn"("GuildUserModerationSettingId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildUserModerationSettingMute_GuildUserModerationSettingId_key" ON "public"."GuildUserModerationSettingMute"("GuildUserModerationSettingId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildUserModerationSettingUnmute_GuildUserModerationSetting_key" ON "public"."GuildUserModerationSettingUnmute"("GuildUserModerationSettingId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildUserModeration_UUID_key" ON "public"."GuildUserModeration"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "GuildDisBotAutoModeration_GuildId_key" ON "public"."GuildDisBotAutoModeration"("GuildId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildDisBotAutoModerationMessages_UUID_key" ON "public"."GuildDisBotAutoModerationMessages"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "GuildDisBotAutoModerationMentions_UUID_key" ON "public"."GuildDisBotAutoModerationMentions"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "GuildDisBotAutoModerationAttachments_UUID_key" ON "public"."GuildDisBotAutoModerationAttachments"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "GuildDisBotAutoModerationEmojis_UUID_key" ON "public"."GuildDisBotAutoModerationEmojis"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "GuildDisBotAutoModerationBlockedWords_UUID_key" ON "public"."GuildDisBotAutoModerationBlockedWords"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "GuildDisBotAutoModerationBlockLinks_UUID_key" ON "public"."GuildDisBotAutoModerationBlockLinks"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "GuildDisBotAutoModerationBlockInvites_UUID_key" ON "public"."GuildDisBotAutoModerationBlockInvites"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "GuildChannelLinks_UUID_key" ON "public"."GuildChannelLinks"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "GuildChannelLinks_ChannelId_key" ON "public"."GuildChannelLinks"("ChannelId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildChannelLinks_WebhookUrl_key" ON "public"."GuildChannelLinks"("WebhookUrl");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordGuildAddon_GuildId_key" ON "public"."DiscordGuildAddon"("GuildId");

-- CreateIndex
CREATE UNIQUE INDEX "Giveaways_UUID_key" ON "public"."Giveaways"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "Giveaways_MessageId_key" ON "public"."Giveaways"("MessageId");

-- CreateIndex
CREATE UNIQUE INDEX "TempVoices_UUID_key" ON "public"."TempVoices"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "TempVoiceChannels_ChannelId_key" ON "public"."TempVoiceChannels"("ChannelId");

-- CreateIndex
CREATE UNIQUE INDEX "TempVoiceChannels_OwnerId_key" ON "public"."TempVoiceChannels"("OwnerId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildLeaveSetup_ChannelId_key" ON "public"."GuildLeaveSetup"("ChannelId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildLeaveSetup_GuildId_key" ON "public"."GuildLeaveSetup"("GuildId");

-- CreateIndex
CREATE UNIQUE INDEX "LeaveImageData_GuildLeaveSetupId_key" ON "public"."LeaveImageData"("GuildLeaveSetupId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildWelcomeSetup_GuildId_key" ON "public"."GuildWelcomeSetup"("GuildId");

-- CreateIndex
CREATE UNIQUE INDEX "WelcomeImageData_GuildWelcomeSetupId_key" ON "public"."WelcomeImageData"("GuildWelcomeSetupId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildLogging_GuildId_key" ON "public"."GuildLogging"("GuildId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildLogs_UUID_key" ON "public"."GuildLogs"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "MessageTemplates_Name_key" ON "public"."MessageTemplates"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "GuildReactionRoles_UUID_key" ON "public"."GuildReactionRoles"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "ReactionRoleSelectmenu_GuildReactionRoleId_key" ON "public"."ReactionRoleSelectmenu"("GuildReactionRoleId");

-- CreateIndex
CREATE UNIQUE INDEX "ReactionRoleButton_GuildReactionRoleId_key" ON "public"."ReactionRoleButton"("GuildReactionRoleId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildSecurity_GuildId_key" ON "public"."GuildSecurity"("GuildId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationGates_UUID_key" ON "public"."VerificationGates"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "GuildSpotifyNotifications_UUID_key" ON "public"."GuildSpotifyNotifications"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_UUID_key" ON "public"."Tags"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_TagId_key" ON "public"."Tags"("TagId");

-- CreateIndex
CREATE UNIQUE INDEX "Polls_UUID_key" ON "public"."Polls"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "PollOptions_UUID_key" ON "public"."PollOptions"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "PollAnswers_UUID_key" ON "public"."PollAnswers"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "TicketSetups_CustomId_key" ON "public"."TicketSetups"("CustomId");

-- CreateIndex
CREATE UNIQUE INDEX "TicketModalData_UUID_key" ON "public"."TicketModalData"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "TicketPermissions_UUID_key" ON "public"."TicketPermissions"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "Tickets_TicketId_key" ON "public"."Tickets"("TicketId");

-- CreateIndex
CREATE UNIQUE INDEX "TicketFeedback_TicketId_key" ON "public"."TicketFeedback"("TicketId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildFeatureToggles_GuildId_key" ON "public"."GuildFeatureToggles"("GuildId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildTwitchNotifications_UUID_key" ON "public"."GuildTwitchNotifications"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "GuildYoutubeNotifications_UUID_key" ON "public"."GuildYoutubeNotifications"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "LevelSettings_GuildId_key" ON "public"."LevelSettings"("GuildId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_UserId_key" ON "public"."Users"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "Apis_Key_key" ON "public"."Apis"("Key");

-- CreateIndex
CREATE UNIQUE INDEX "Apis_UserId_key" ON "public"."Apis"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildBackups_UUID_key" ON "public"."GuildBackups"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "Vanitys_UUID_key" ON "public"."Vanitys"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "Vanitys_Slug_key" ON "public"."Vanitys"("Slug");

-- CreateIndex
CREATE UNIQUE INDEX "VanityEmbed_VanityId_key" ON "public"."VanityEmbed"("VanityId");

-- CreateIndex
CREATE UNIQUE INDEX "VanityEmbedAuthor_VanityEmbedsId_key" ON "public"."VanityEmbedAuthor"("VanityEmbedsId");

-- CreateIndex
CREATE UNIQUE INDEX "VanityAnalytic_VanityId_key" ON "public"."VanityAnalytic"("VanityId");

-- CreateIndex
CREATE UNIQUE INDEX "VanityAnalyticsLatest30Day_VanityAnalyticsId_key" ON "public"."VanityAnalyticsLatest30Day"("VanityAnalyticsId");

-- CreateIndex
CREATE UNIQUE INDEX "DisBot_GetConf_key" ON "public"."DisBot"("GetConf");

-- AddForeignKey
ALTER TABLE "public"."GuildCommandManger" ADD CONSTRAINT "GuildCommandManger_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BuildInCommands" ADD CONSTRAINT "BuildInCommands_GuildCommandMangerId_fkey" FOREIGN KEY ("GuildCommandMangerId") REFERENCES "public"."GuildCommandManger"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildComponentManager" ADD CONSTRAINT "GuildComponentManager_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildInteractionPermissions" ADD CONSTRAINT "GuildInteractionPermissions_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildAutoDeletes" ADD CONSTRAINT "GuildAutoDeletes_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildAutoPublish" ADD CONSTRAINT "GuildAutoPublish_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildAutoReacts" ADD CONSTRAINT "GuildAutoReacts_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildAutoRoles" ADD CONSTRAINT "GuildAutoRoles_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModerationScout" ADD CONSTRAINT "ModerationScout_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModerationScoutCases" ADD CONSTRAINT "ModerationScoutCases_ModerationScoutId_fkey" FOREIGN KEY ("ModerationScoutId") REFERENCES "public"."ModerationScout"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModerationScoutForms" ADD CONSTRAINT "ModerationScoutForms_UUID_fkey" FOREIGN KEY ("UUID") REFERENCES "public"."ModerationScout"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModerationScoutFormsData" ADD CONSTRAINT "ModerationScoutFormsData_UUID_fkey" FOREIGN KEY ("UUID") REFERENCES "public"."ModerationScoutForms"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModerationScoutUserAppeals" ADD CONSTRAINT "ModerationScoutUserAppeals_ModerationScoutFormId_fkey" FOREIGN KEY ("ModerationScoutFormId") REFERENCES "public"."ModerationScoutForms"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModerationScoutUserAppeals" ADD CONSTRAINT "ModerationScoutUserAppeals_UUID_fkey" FOREIGN KEY ("UUID") REFERENCES "public"."ModerationScout"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModerationScoutReportModalData" ADD CONSTRAINT "ModerationScoutReportModalData_UUID_fkey" FOREIGN KEY ("UUID") REFERENCES "public"."ModerationScout"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModerationScoutReports" ADD CONSTRAINT "ModerationScoutReports_UUID_fkey" FOREIGN KEY ("UUID") REFERENCES "public"."ModerationScout"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildModeration" ADD CONSTRAINT "GuildModeration_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildUserModerationSettingBan" ADD CONSTRAINT "GuildUserModerationSettingBan_GuildUserModerationSettingId_fkey" FOREIGN KEY ("GuildUserModerationSettingId") REFERENCES "public"."GuildModeration"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildUserModerationSettingUnban" ADD CONSTRAINT "GuildUserModerationSettingUnban_GuildUserModerationSetting_fkey" FOREIGN KEY ("GuildUserModerationSettingId") REFERENCES "public"."GuildModeration"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildUserModerationSettinKick" ADD CONSTRAINT "GuildUserModerationSettinKick_GuildUserModerationSettingId_fkey" FOREIGN KEY ("GuildUserModerationSettingId") REFERENCES "public"."GuildModeration"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildUserModerationSettingWarn" ADD CONSTRAINT "GuildUserModerationSettingWarn_GuildUserModerationSettingI_fkey" FOREIGN KEY ("GuildUserModerationSettingId") REFERENCES "public"."GuildModeration"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildUserModerationSettingUnwarn" ADD CONSTRAINT "GuildUserModerationSettingUnwarn_GuildUserModerationSettin_fkey" FOREIGN KEY ("GuildUserModerationSettingId") REFERENCES "public"."GuildModeration"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildUserModerationSettingMute" ADD CONSTRAINT "GuildUserModerationSettingMute_GuildUserModerationSettingI_fkey" FOREIGN KEY ("GuildUserModerationSettingId") REFERENCES "public"."GuildModeration"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildUserModerationSettingUnmute" ADD CONSTRAINT "GuildUserModerationSettingUnmute_GuildUserModerationSettin_fkey" FOREIGN KEY ("GuildUserModerationSettingId") REFERENCES "public"."GuildModeration"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildUserModeration" ADD CONSTRAINT "GuildUserModeration_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildUserModeration" ADD CONSTRAINT "GuildUserModeration_LinkedCaseId_fkey" FOREIGN KEY ("LinkedCaseId") REFERENCES "public"."ModerationScoutCases"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildDisBotAutoModeration" ADD CONSTRAINT "GuildDisBotAutoModeration_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildDisBotAutoModerationMessages" ADD CONSTRAINT "GuildDisBotAutoModerationMessages_GuildDisBotAutoModeratio_fkey" FOREIGN KEY ("GuildDisBotAutoModerationId") REFERENCES "public"."GuildDisBotAutoModeration"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildDisBotAutoModerationMentions" ADD CONSTRAINT "GuildDisBotAutoModerationMentions_GuildDisBotAutoModeratio_fkey" FOREIGN KEY ("GuildDisBotAutoModerationId") REFERENCES "public"."GuildDisBotAutoModeration"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildDisBotAutoModerationAttachments" ADD CONSTRAINT "GuildDisBotAutoModerationAttachments_GuildDisBotAutoModera_fkey" FOREIGN KEY ("GuildDisBotAutoModerationId") REFERENCES "public"."GuildDisBotAutoModeration"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildDisBotAutoModerationEmojis" ADD CONSTRAINT "GuildDisBotAutoModerationEmojis_GuildDisBotAutoModerationI_fkey" FOREIGN KEY ("GuildDisBotAutoModerationId") REFERENCES "public"."GuildDisBotAutoModeration"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildDisBotAutoModerationBlockedWords" ADD CONSTRAINT "GuildDisBotAutoModerationBlockedWords_GuildDisBotAutoModer_fkey" FOREIGN KEY ("GuildDisBotAutoModerationId") REFERENCES "public"."GuildDisBotAutoModeration"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildDisBotAutoModerationBlockLinks" ADD CONSTRAINT "GuildDisBotAutoModerationBlockLinks_GuildDisBotAutoModerat_fkey" FOREIGN KEY ("GuildDisBotAutoModerationId") REFERENCES "public"."GuildDisBotAutoModeration"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildDisBotAutoModerationBlockInvites" ADD CONSTRAINT "GuildDisBotAutoModerationBlockInvites_GuildDisBotAutoModer_fkey" FOREIGN KEY ("GuildDisBotAutoModerationId") REFERENCES "public"."GuildDisBotAutoModeration"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildChannelLinks" ADD CONSTRAINT "GuildChannelLinks_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SyncedChannelLinkMessages" ADD CONSTRAINT "SyncedChannelLinkMessages_ChannelLinkId_fkey" FOREIGN KEY ("ChannelLinkId") REFERENCES "public"."GuildChannelLinks"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiscordGuildAddon" ADD CONSTRAINT "DiscordGuildAddon_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Giveaways" ADD CONSTRAINT "Giveaways_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TempVoices" ADD CONSTRAINT "TempVoices_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TempVoiceChannels" ADD CONSTRAINT "TempVoiceChannels_TempVoiceId_fkey" FOREIGN KEY ("TempVoiceId") REFERENCES "public"."TempVoices"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildLeaveSetup" ADD CONSTRAINT "GuildLeaveSetup_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaveImageData" ADD CONSTRAINT "LeaveImageData_GuildLeaveSetupId_fkey" FOREIGN KEY ("GuildLeaveSetupId") REFERENCES "public"."GuildLeaveSetup"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildWelcomeSetup" ADD CONSTRAINT "GuildWelcomeSetup_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WelcomeImageData" ADD CONSTRAINT "WelcomeImageData_GuildWelcomeSetupId_fkey" FOREIGN KEY ("GuildWelcomeSetupId") REFERENCES "public"."GuildWelcomeSetup"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildLogging" ADD CONSTRAINT "GuildLogging_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildLogs" ADD CONSTRAINT "GuildLogs_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessageTemplates" ADD CONSTRAINT "MessageTemplates_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildReactionRoles" ADD CONSTRAINT "GuildReactionRoles_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReactionRoleSelectmenu" ADD CONSTRAINT "ReactionRoleSelectmenu_GuildReactionRoleId_fkey" FOREIGN KEY ("GuildReactionRoleId") REFERENCES "public"."GuildReactionRoles"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReactionRoleButton" ADD CONSTRAINT "ReactionRoleButton_GuildReactionRoleId_fkey" FOREIGN KEY ("GuildReactionRoleId") REFERENCES "public"."GuildReactionRoles"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildSecurity" ADD CONSTRAINT "GuildSecurity_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerificationGates" ADD CONSTRAINT "VerificationGates_SecurityId_fkey" FOREIGN KEY ("SecurityId") REFERENCES "public"."GuildSecurity"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerificationGatesPermission" ADD CONSTRAINT "VerificationGatesPermission_VerificationGateId_fkey" FOREIGN KEY ("VerificationGateId") REFERENCES "public"."VerificationGates"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildSpotifyNotifications" ADD CONSTRAINT "GuildSpotifyNotifications_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tags" ADD CONSTRAINT "Tags_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Polls" ADD CONSTRAINT "Polls_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PollOptions" ADD CONSTRAINT "PollOptions_PollId_fkey" FOREIGN KEY ("PollId") REFERENCES "public"."Polls"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PollAnswers" ADD CONSTRAINT "PollAnswers_PollId_fkey" FOREIGN KEY ("PollId") REFERENCES "public"."Polls"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PollAnswers" ADD CONSTRAINT "PollAnswers_PollOptionId_fkey" FOREIGN KEY ("PollOptionId") REFERENCES "public"."PollOptions"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketSetups" ADD CONSTRAINT "TicketSetups_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketModalData" ADD CONSTRAINT "TicketModalData_TicketSetupId_fkey" FOREIGN KEY ("TicketSetupId") REFERENCES "public"."TicketSetups"("CustomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketPermissions" ADD CONSTRAINT "TicketPermissions_TicketSetupId_fkey" FOREIGN KEY ("TicketSetupId") REFERENCES "public"."TicketSetups"("CustomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tickets" ADD CONSTRAINT "Tickets_TicketSetupId_fkey" FOREIGN KEY ("TicketSetupId") REFERENCES "public"."TicketSetups"("CustomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketFeedback" ADD CONSTRAINT "TicketFeedback_TicketId_fkey" FOREIGN KEY ("TicketId") REFERENCES "public"."Tickets"("TicketId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildFeatureToggles" ADD CONSTRAINT "GuildFeatureToggles_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildTwitchNotifications" ADD CONSTRAINT "GuildTwitchNotifications_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildYoutubeNotifications" ADD CONSTRAINT "GuildYoutubeNotifications_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LevelSettings" ADD CONSTRAINT "LevelSettings_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."XPDrops" ADD CONSTRAINT "XPDrops_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."LevelSettings"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."XPStreaks" ADD CONSTRAINT "XPStreaks_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."LevelSettings"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LevelRoles" ADD CONSTRAINT "LevelRoles_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."LevelSettings"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Levels" ADD CONSTRAINT "Levels_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."LevelSettings"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Levels" ADD CONSTRAINT "Levels_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "public"."Users"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Apis" ADD CONSTRAINT "Apis_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "public"."Users"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuildBackups" ADD CONSTRAINT "GuildBackups_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "public"."Users"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vanitys" ADD CONSTRAINT "Vanitys_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "public"."Users"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VanityEmbed" ADD CONSTRAINT "VanityEmbed_VanityId_fkey" FOREIGN KEY ("VanityId") REFERENCES "public"."Vanitys"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VanityEmbedAuthor" ADD CONSTRAINT "VanityEmbedAuthor_VanityEmbedsId_fkey" FOREIGN KEY ("VanityEmbedsId") REFERENCES "public"."VanityEmbed"("VanityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VanityAnalytic" ADD CONSTRAINT "VanityAnalytic_VanityId_fkey" FOREIGN KEY ("VanityId") REFERENCES "public"."Vanitys"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VanityAnalyticsLatest30Day" ADD CONSTRAINT "VanityAnalyticsLatest30Day_VanityAnalyticsId_fkey" FOREIGN KEY ("VanityAnalyticsId") REFERENCES "public"."VanityAnalytic"("VanityId") ON DELETE RESTRICT ON UPDATE CASCADE;

