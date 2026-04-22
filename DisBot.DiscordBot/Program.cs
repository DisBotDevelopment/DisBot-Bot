using Microsoft.Extensions.Hosting;

namespace DisBot.DiscordBot;

public static class Program
{
    public static async Task Main(string[] args)
    {
        var builder = Host.CreateApplicationBuilder(args);
        await Startup.Startup.Initialise(builder);
        var app = builder.Build();
        await Startup.Startup.Load(app);
        await app.RunAsync();
    }
}