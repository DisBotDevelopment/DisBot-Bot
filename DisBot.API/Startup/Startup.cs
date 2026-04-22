namespace DisBot.API.Startup;

public static partial class Startup
{
    public static async Task Initialise(this WebApplicationBuilder builder)
    {
        await builder.InitialiseBase();
        await builder.InitialiseDatabase();
        await builder.InitialiseAuth();
    }

    public static async Task Load(this WebApplication application)
    {
        await application.LoadBase();
        await application.LoadDatabase();
        await application.LoadAuth();
    }
}