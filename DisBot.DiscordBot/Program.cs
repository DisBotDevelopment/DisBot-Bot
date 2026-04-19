using Microsoft.Extensions.Hosting;

namespace DiscordBot;

public static class Program
{
    public static async Task Main(string[] args)
    {
        var builder = new HostApplicationBuilder(args);
        await Startup.Startup.Initialise(builder);
        var app = builder.Build();
        await Startup.Startup.Load(app);
        await app.RunAsync();
    }
}