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
        await using var scope = application.Services.CreateAsyncScope();
        var dataContext = scope.ServiceProvider.GetService<DataContext>();
        var migrations = await dataContext.Database.GetPendingMigrationsAsync();
        if (dataContext == null) throw new Exception("No Database Context found...");
        if (migrations.ToArray().Length > 0)
            await dataContext.Database.MigrateAsync();
    }
}