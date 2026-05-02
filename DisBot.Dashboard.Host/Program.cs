using DisBot.Shared.Configuration;

namespace DisBot.Dashboard.Host;

public static class Program
{
    public static async Task Main(String[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddOptions<BackendOptions>().BindConfiguration("Backend");
        builder.Services.AddControllers();
        var application = builder.Build();

        application.MapControllers();
        application.UseBlazorFrameworkFiles();
        application.UseStaticFiles();
        application.UseRouting();
        application.MapFallbackToFile("index.html");

        await application.RunAsync();
    }
}