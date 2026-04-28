using DisBot.Dashboard.Client.Startup;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

namespace DisBot.Dashboard.Client;

public static class Program
{
    public static async Task Main(String[] args)
    {
        var builder = WebAssemblyHostBuilder.CreateDefault(args);
        await builder.PerformPreBuild();
        await builder.Build().RunAsync();
    }
}