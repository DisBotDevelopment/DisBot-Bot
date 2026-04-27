using DisBot.Dashboard.Configuration;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using ShadcnBlazor;
using ShadcnBlazor.Extras;

namespace DisBot.Dashboard.Startup;

public static partial class Startup
{
    private static void AddBase(WebAssemblyHostBuilder builder)
    {
        builder.Services.AddOptions<BackendOptions>().BindConfiguration("Backend");
        var backendOptions = builder.Configuration.GetSection("Backend").Get<BackendOptions>();
        
        builder.RootComponents.Add<App>("#app");
        builder.RootComponents.Add<HeadOutlet>("head::after");
        builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(backendOptions.ApiUrl) });
        builder.Services.AddShadcnBlazor();
        builder.Services.AddShadcnBlazorExtras();
    }
}