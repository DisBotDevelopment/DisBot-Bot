using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using DisBot.Shared.Http.Responses.Auth;
using Microsoft.AspNetCore.Components.Authorization;
using SerializationContext = DisBot.Shared.SerializationContext;

namespace DisBot.Dashboard.Services;

public class RemoteAuthProvider : AuthenticationStateProvider
{
    private readonly ILogger<RemoteAuthProvider> Logger;
    private readonly HttpClient HttpClient;

    public RemoteAuthProvider(ILogger<RemoteAuthProvider> logger, HttpClient httpClient)
    {
        Logger = logger;
        HttpClient = httpClient;
    }

    public override async Task<AuthenticationState> GetAuthenticationStateAsync()
    {
        try
        {
            var claimResponses = await HttpClient.GetFromJsonAsync<ClaimDto[]>(
                "api/auth/claims", SerializationContext.Default.Options
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