namespace DisBot.API.Startup;

public static partial class Startup
{
    private static async Task InitialiseAuth(this WebApplicationBuilder builder)
    {
        builder.Services.AddAuthentication();
        builder.Services.AddAuthorization();
        // TODO ADD AUTH
    }

    private static async Task LoadAuth(this WebApplication application)
    {
        application.UseAuthentication();
        application.UseAuthorization();
    }
}