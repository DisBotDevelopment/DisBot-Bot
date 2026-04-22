using DisBot.API.Startup;

namespace DisBot.API;

public static class Programm
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        await builder.Initialise();
        var app = builder.Build();
        await app.Load();
        await app.RunAsync();
    }
}