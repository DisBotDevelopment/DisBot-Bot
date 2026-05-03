using System.Net.Http.Json;
using DisBot.Dashboard.Client.Services;
using DisBot.Shared;
using DisBot.Shared.Http.Responses.Frontend;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using ShadcnBlazor;
using ShadcnBlazor.Extras;

namespace DisBot.Dashboard.Client.Startup;

public static partial class Startup
{
    private static async Task AddBase(WebAssemblyHostBuilder builder)
    {
        var httpClient = new HttpClient();
        var data = await httpClient.GetFromJsonAsync<BackendResponse>($"{builder.HostEnvironment.BaseAddress}config",
            SerializationContext.Default.Options);

        builder.RootComponents.Add<App>("#app");
        builder.RootComponents.Add<HeadOutlet>("head::after");

        builder.Services.AddScoped(sp => new HttpClient
        {
            BaseAddress = new Uri(data.BackendUrl)
        });
        builder.Services.AddScoped<HttpService>();
        builder.Services.AddShadcnBlazor();
        builder.Services.AddShadcnBlazorExtras();
    }
}