using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using DisBot.Shared.Http.Responses.Auth;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components.WebAssembly.Http;
using Microsoft.JSInterop;
using SerializationContext = DisBot.Shared.SerializationContext;

namespace DisBot.Dashboard.Client.Services;

public class RemoteAuthProvider : AuthenticationStateProvider
{
    private readonly ILogger<RemoteAuthProvider> Logger;
    private readonly IJSRuntime JsRuntime;
    private readonly HttpClient HttpClient;

    public RemoteAuthProvider(ILogger<RemoteAuthProvider> logger, IJSRuntime jsRuntime, HttpClient httpClient
    )
    {
        Logger = logger;
        JsRuntime = jsRuntime;
        HttpClient = httpClient;
    }

    public override async Task<AuthenticationState> GetAuthenticationStateAsync()
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "v1/auth/claims");
            // TODO: Change this to normal Headers and a HttpClient if possible.
            // request.Headers.Add("cookie", "token=...");
            request.SetBrowserRequestCredentials(BrowserRequestCredentials.Include);

            var response = await HttpClient.SendAsync(request);
            var claimResponses = await response.Content.ReadFromJsonAsync<ClaimDto[]>(
                SerializationContext.Default.Options
            );

            var claims = claimResponses!.Select(claim => new Claim(claim.Type, claim.Value));

            return new AuthenticationState(
                new ClaimsPrincipal(new ClaimsIdentity(claims, "remote"))
            );
        }
        catch (HttpRequestException e)
        {
            if (e.StatusCode != HttpStatusCode.Unauthorized)
                Logger.LogError(e, "An api error occured while requesting claims from api");
        }
        catch (Exception e)
        {
            Logger.LogError(e, "An unhandled error occured while requesting claims from api");
        }

        return new AuthenticationState(new ClaimsPrincipal());
    }
}