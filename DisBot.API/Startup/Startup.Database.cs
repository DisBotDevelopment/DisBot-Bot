using DisBot.API.Database;
using Microsoft.EntityFrameworkCore;

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
        
        await using var scope = application.Services.CreateAsyncScope();
        var dataContext = scope.ServiceProvider.GetService<DataContext>();
        var migrations = await dataContext.Database.GetPendingMigrationsAsync();
        if (dataContext == null) throw new Exception("No Database Context found...");
        application.Logger.Log(LogLevel.Information, "Database initialized.");
        if (migrations.ToArray().Length > 0)
        {
            await dataContext.Database.MigrateAsync();
            application.Logger.Log(LogLevel.Information, "Database migrated.");
        }
        application.Logger.Log(LogLevel.Information, "Database ready to accept connections.");
    }
}