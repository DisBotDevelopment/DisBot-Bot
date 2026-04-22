using DisBot.DiscordBot.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace DisBot.DiscordBot.Startup;

public static partial class Startup
{
    private static async Task InitialiseDatabase(this HostApplicationBuilder builder)
    {
        builder.Services.AddDbContext<DataContext>();
    }
}