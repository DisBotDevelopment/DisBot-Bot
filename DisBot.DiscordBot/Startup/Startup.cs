using Microsoft.Extensions.Hosting;

namespace DiscordBot.Startup;

public static partial class Startup
{
    public static async Task Initialise(IHostApplicationBuilder builder)
    {
        await InitialiseBase(builder);
        await InitialiseDatabase(builder);
        await InitialiseBot(builder);
    }

    public static async Task Load(IHost host)
    {
        await LoadBase(host);
        await LoadBot(host);
    }
}