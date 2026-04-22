using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using DisBot.Dashboard.Startup;

public static class Program
{
    public static async Task Main(String[] args)
    {
        var builder = WebAssemblyHostBuilder.CreateDefault(args);

        builder.PerformPreBuild();

        await builder.Build().RunAsync();
    }
}