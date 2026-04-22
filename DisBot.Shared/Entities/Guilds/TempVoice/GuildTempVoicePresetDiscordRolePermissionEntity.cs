using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.TempVoice;

public class GuildTempVoicePresetDiscordRolePermissionEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public ulong RoleId { get; set; }

    public string[] AllowedDiscordPermissions { get; set; } = [];
    public string[] DeniedDiscordPermissions { get; set; } = [];

    [Required] public GuildTempVoicePresetEntity TempVoicePreset { get; set; }
}