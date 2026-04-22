using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

namespace DisBot.Dashboard.Startup;

public static partial class Startup
{
    public static void PerformPreBuild(this WebAssemblyHostBuilder builder)
    {
        AddBase(builder);
        AddAuth(builder);
    }
}