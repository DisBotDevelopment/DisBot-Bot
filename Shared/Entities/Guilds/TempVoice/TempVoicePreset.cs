using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities.Guilds.TempVoice;

public class TempVoicePreset
{
    public int Id { get; set; }
    [Column("UUID")] public required Guild Uuid { get; set; }
    public string? ChannelName { get; set; }
    public int? ChannelLimit { get; set; }
    public string? ChannelRegion { get; set; }
    public string? ChannelBitRate { get; set; }
    public string? UserInviteType { get; set; }
    public bool SendLogsInTempChannel { get; set; }
    public string? BlacklistRoleId { get; set; }
    public string[] ManageComponents { get; set; } = [];
    public string[] OwnerAllowedDiscordPermissions { get; set; } = [];
    public string[] OwnerDeniedDiscordPermissions { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public ICollection<TempVoiceConfig>? TempVoiceConfig { get; set; } = new List<TempVoiceConfig>();

    public ICollection<TempVoicePresetDiscordRolePermission> RolePermissions { get; set; } =
        new List<TempVoicePresetDiscordRolePermission>();

    public required TempVoice TempVoice { get; set; }
}