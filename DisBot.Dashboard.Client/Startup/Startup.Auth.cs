using DisBot.Dashboard.Client.Services;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

namespace DisBot.Dashboard.Client.Startup;

public static partial class Startup
{
    private static void AddAuth(WebAssemblyHostBuilder builder)
    {
        builder.Services.AddScoped<AuthenticationStateProvider, RemoteAuthProvider>();
        builder.Services.AddAuthorizationCore();
        builder.Services.AddCascadingAuthenticationState();
    }
}