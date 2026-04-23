using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Welcome;

public class GuildWelcomeImageDataEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public string Title { get; set; }
    [Required] public string Text { get; set; }
    [Required] public string Subtitle { get; set; }
    [Required] public string Color { get; set; }
    public string? Background { get; set; }
    public string? Theme { get; set; }
    public string? Gradient { get; set; }

    public int WelcomeSetupId { get; set; }
    [Required] public GuildWelcomeSetupEntity WelcomeSetup { get; set; }
}