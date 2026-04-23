using DisBot.API.Database;
using Microsoft.EntityFrameworkCore;
using Shared.Configuration;

namespace DisBot.API.Startup;

public static partial class Startup
{
    private static async Task InitialiseDatabase(this WebApplicationBuilder builder)
    {
        builder.Services.AddDbContext<DataContext>();
    }

    private static async Task LoadDatabase(this WebApplication application)
    {
        application.Logger.Log(LogLevel.Information, "Loading database...");

        Console.WriteLine(application.Configuration.GetSection("Database").Get<DatabaseOptions>());
        
        await using var scope = application.Services.CreateAsyncScope();
        var dataContext = scope.ServiceProvider.GetService<DataContext>();
        application.Logger.Log(LogLevel.Information, "Database initialized.");
        await dataContext.Database.MigrateAsync();
        application.Logger.Log(LogLevel.Information, "Database migrated.");
        application.Logger.Log(LogLevel.Information, "Database ready to accept connections.");
    }
}