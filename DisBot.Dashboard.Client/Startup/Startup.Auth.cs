using DisBot.Dashboard.Services;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using ShadcnBlazor;
using ShadcnBlazor.Extras;

namespace DisBot.Dashboard.Startup;

public static partial class Startup
{
    private static void AddAuth(WebAssemblyHostBuilder builder)
    {
        builder.Services.AddScoped<AuthenticationStateProvider, RemoteAuthProvider>();
        builder.Services.AddAuthorizationCore();
        builder.Services.AddCascadingAuthenticationState();
        
    }
}