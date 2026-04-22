using DisBot.DiscordBot.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Shared.Configuration;

namespace DisBot.DiscordBot.Startup;

public partial class Startup
{
    private static async Task InitialiseBase(this HostApplicationBuilder builder)
    {
        builder.Services.AddOptions<DatabaseOptions>().BindConfiguration("Database");
        builder.Services.AddOptions<BotOptions>().BindConfiguration("Bot");
    }

    private static async Task LoadBase(this IHost host)
    {
    }
}