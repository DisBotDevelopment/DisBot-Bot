using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.TempVoice;

public class GuildTempVoicePresetDiscordRolePermissionEntity
{
    public int Id { get; set; }
    [Required] public ulong RoleId { get; set; }

    public string[] AllowedDiscordPermissions { get; set; } = [];
    public string[] DeniedDiscordPermissions { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildTempVoicePresetEntity TempVoicePreset { get; set; }
}