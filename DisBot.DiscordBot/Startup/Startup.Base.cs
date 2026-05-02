using DisBot.DiscordBot.Configuration;
using DisBot.DiscordBot.Services.Internal;
using DisBot.Shared.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace DisBot.DiscordBot.Startup;

public partial class Startup
{
    private static async Task InitialiseBase(this HostApplicationBuilder builder)
    {
        builder.Services.AddOptions<DatabaseOptions>().BindConfiguration("Database");
        builder.Services.AddOptions<BotOptions>().BindConfiguration("Bot");
        builder.Services.AddOptions<LoggingOptions>().BindConfiguration("Logging");
        builder.Services.AddSingleton<EmojiService>();
    }

    private static async Task LoadBase(this IHost host)
    {
        await host.Services.GetRequiredService<EmojiService>().Initialize();
    }
}