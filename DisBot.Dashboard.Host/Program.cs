public static class Program
{
    public static async Task Main(String[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        
        var application = builder.Build();

        application.UseBlazorFrameworkFiles();
        application.UseStaticFiles();
        application.UseRouting();
        application.MapFallbackToFile("index.html");
        
        await application.RunAsync();
    }
}