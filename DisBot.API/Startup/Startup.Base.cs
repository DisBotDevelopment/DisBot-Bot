using DisBot.API.Configuration;
using Shared.Configuration;

namespace DisBot.API.Startup;

public partial class Startup
{
    private static async Task InitialiseBase(this WebApplicationBuilder builder)
    {
        builder.Services.AddControllers();
        
        builder.Services.AddOptions<DatabaseOptions>().BindConfiguration("Database");
        builder.Services.AddOptions<OAuth2Options>().BindConfiguration("OAuth2");
        builder.Services.AddOptions<SessionOptions>().BindConfiguration("Session");
        builder.Services.AddOpenApi();
    }

    private static async Task LoadBase(this WebApplication application)
    {
        application.MapOpenApi();
        application.UseHttpsRedirection();
    }
}