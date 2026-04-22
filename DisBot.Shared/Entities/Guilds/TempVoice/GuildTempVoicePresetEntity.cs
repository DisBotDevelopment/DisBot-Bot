using System.ComponentModel.DataAnnotations;
using Shared.Enums.TempVoice;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.TempVoice;

public class GuildTempVoicePresetEntity : IActionTimestamps
{
    public int Id { get; set; }
    public string? ChannelName { get; set; }
    public int? ChannelLimit { get; set; } = 0;
    public string? ChannelRegion { get; set; } = "auto";
    public int? ChannelBitRate { get; set; } = 0;
    public TempVoiceUserInviteType? UserInviteType { get; set; }
    public bool SendLogsInTempChannel { get; set; }
    public ulong? BlacklistRoleId { get; set; }
    public string[] ManageComponents { get; set; } = [];
    public string[] OwnerAllowedDiscordPermissions { get; set; } = [];
    public string[] OwnerDeniedDiscordPermissions { get; set; } = [];
    
    public List<GuildTempVoiceConfigEntity>? TempVoiceConfig { get; set; } = [];
    public List<GuildTempVoicePresetDiscordRolePermissionEntity> RolePermissions { get; set; } = [];
    [Required] public GuildTempVoiceSettingsEntity TempVoiceSettings { get; set; }
}