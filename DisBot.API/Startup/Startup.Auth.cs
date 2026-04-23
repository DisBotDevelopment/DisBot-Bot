namespace DisBot.API.Startup;

public static partial class Startup
{
    private static async Task InitialiseAuth(this WebApplicationBuilder builder)
    {
        builder.Services.AddAuthentication();
        builder.Services.AddAuthorization();
    }

    private static async Task LoadAuth(this WebApplication application)
    {
        application.UseAuthentication();
        application.UseAuthorization();
    }
}