using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

namespace DisBot.Dashboard.Client.Startup;

public static partial class Startup
{
    public static async Task PerformPreBuild(this WebAssemblyHostBuilder builder)
    {
        await AddBase(builder);
        AddAuth(builder);
    }
}