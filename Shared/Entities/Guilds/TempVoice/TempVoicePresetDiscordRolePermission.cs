namespace Shared.Entities.Guilds.TempVoice;

public class TempVoicePresetDiscordRolePermission
{
    public int Id { get; set; }
    public required ulong RoleId { get; set; }
    
    public string[] AllowedDiscordPermissions { get; set; } = [];
    public string[] DeniedDiscordPermissions { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public required TempVoicePreset TempVoicePreset { get; set; }
}