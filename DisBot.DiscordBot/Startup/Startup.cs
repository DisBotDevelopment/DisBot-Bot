using DisBot.DiscordBot.Database;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace DisBot.DiscordBot.Startup;

public static partial class Startup
{
    public static async Task Initialise(this HostApplicationBuilder builder)
    {
        await builder.InitialiseBase();
        await builder.InitialiseDatabase();
        await builder.InitialiseBot();
    }

    public static async Task Load(this IHost host)
    {
        await host.LoadBase();
        await host.LoadBot();
    }
}