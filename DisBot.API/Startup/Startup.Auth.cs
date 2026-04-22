namespace DisBot.API.Startup;

public static partial class Startup
{
    private static async Task InitialiseAuth(this WebApplicationBuilder builder)
    {
        builder.Services.AddAuthentication();
    }

    private static async Task LoadAuth(this WebApplication host)
    {
    }
}