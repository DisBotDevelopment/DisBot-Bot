using DiscordBot.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace DiscordBot.Startup;

public partial class Startup
{
    private static async Task InitialiseBase(IHostApplicationBuilder builder)
    {
        builder.Services.AddOptions<DatabaseOptions>().BindConfiguration("Database");
        builder.Services.AddOptions<BotOptions>().BindConfiguration("Bot");
    }
    
    private static async Task LoadBase(IHost host)
    {
    }
}