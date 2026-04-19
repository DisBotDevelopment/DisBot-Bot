using DiscordBot.Configuration;
using DiscordBot.Database;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace DiscordBot.Startup;

public static partial class Startup
{
    private static async Task InitialiseDatabase(IHostApplicationBuilder builder)
    {
        builder.Services.AddDbContext<DataContext>();
    }
}