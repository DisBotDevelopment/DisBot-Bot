namespace DisBot.DiscordBot.Configuration;

public class BotOptions
{
    public required ulong DiscordAdminGuildId { get; set; }
    public required string DiscordApplicationToken { get; set; }
    public required ulong DiscordApplicationId { get; set; }
}