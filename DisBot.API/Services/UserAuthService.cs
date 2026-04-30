using System.Net.Http.Headers;
using System.Security.AccessControl;
using System.Security.Claims;
using System.Text.Json;
using DisBot.API.Configuration;
using DisBot.API.Database;
using DisBot.Shared;
using DisBot.Shared.Entities.Users;
using DisBot.Shared.Models.Discord;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Namotion.Reflection;
using NetCord;

namespace DisBot.API.Services;

public class UserAuthService
{
    private readonly IHttpClientFactory HttpClientFactory;
    private readonly IMemoryCache MemoryCache;
    private readonly ILogger<UserAuthService> Logger;
    private readonly DataContext DataContext;
    private readonly IOptions<SessionsOptions> SessionsOptions;

    private const string UserIdClaim = "UserId";
    private const string IssuedAtClaim = "IssuedAt";
    private const string CacheKeyFormat = $"{nameof(UserAuthService)}_{nameof(ValidateAsync)}_{{0}}";

    public UserAuthService(
        IHttpClientFactory httpClientFactory,
        ILogger<UserAuthService> logger,
        DataContext dataContext,
        IOptions<SessionsOptions> sessionsOptions,
        IMemoryCache memoryCache
    )
    {
        HttpClientFactory = httpClientFactory;
        DataContext = dataContext;
        Logger = logger;
        SessionsOptions = sessionsOptions;
        MemoryCache = memoryCache;
    }

    public async Task<bool> SyncAsync(CookieSigningInContext context)
    {
        if (context.Principal is null)
            return false;

        var userId = context.Principal.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userId))
        {
            Logger.LogWarning("Unable to sync user to database as name and/or email claims are missing");
            return false;
        }

        var user = await DataContext.Users
            .FirstOrDefaultAsync(user => user.DiscordUserId == ulong.Parse(userId));

        var idToken = context.Properties.Items.Where(pair => pair.Key == ".Token.id_token").Select(pair => pair.Value)
            .FirstOrDefault();
        var accessToken = context.Properties.Items.Where(pair => pair.Key == ".Token.access_token")
            .Select(pair => pair.Value)
            .FirstOrDefault();
        var refreshToken = context.Properties.Items.Where(pair => pair.Key == ".Token.refresh_token")
            .Select(pair => pair.Value)
            .FirstOrDefault();

        if (string.IsNullOrWhiteSpace(idToken) || string.IsNullOrWhiteSpace(refreshToken) ||
            string.IsNullOrWhiteSpace(accessToken))
        {
            Logger.LogWarning("Unable to get Token data from OAuth Flow.");
            return false;
        }

        var discordData = await FetchDiscordDataAsync(accessToken);
        if (discordData == null) return false;

        if (user == null) // Sync user if not already existing in the database
        {
            var createdUser = await DataContext.Users.AddAsync(new UserEntity
            {
                Username = discordData.User.Username,
                DiscordUserId = ulong.Parse(discordData.User.Id),
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                InvalidateTimestamp = DateTimeOffset.UtcNow.AddMinutes(-1)
            });
            await DataContext.SaveChangesAsync();
            user = createdUser.Entity;
        }
        else // Update properties of existing user
        {
            user.Username = discordData.User.Username;
            user.AccessToken = accessToken;
            user.RefreshToken = refreshToken;
            await DataContext.SaveChangesAsync();
        }

        context.Principal.Identities.First().AddClaims([
            new Claim(UserIdClaim, user.DiscordUserId.ToString()),
            new Claim(IssuedAtClaim, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString())
        ]);

        return true;
    }

    public async Task<bool> ValidateAsync(ClaimsPrincipal? principal)
    {
        // Ignore malformed claims principal
        if (principal is not { Identity.IsAuthenticated: true })
            return false;

        var userIdString = principal.FindFirstValue(UserIdClaim);

        if (!ulong.TryParse(userIdString, out var userId))
            return false;

        var issuedAtString = principal.FindFirstValue(IssuedAtClaim);

        if (!long.TryParse(issuedAtString, out var issuedAtUnix))
            return false;

        var issuedAt = DateTimeOffset.FromUnixTimeSeconds(issuedAtUnix).ToUniversalTime();

        // Handle caching
        var cacheKey = string.Format(CacheKeyFormat, userId);

        if (!MemoryCache.TryGetValue<UserSession>(cacheKey, out var session))
        {
            session = await DataContext.Users
                .AsNoTracking()
                .Where(user => user.DiscordUserId == ulong.Parse(userId.ToString()))
                .Select(user => new UserSession(user.InvalidateTimestamp))
                .FirstOrDefaultAsync();

            if (session == null)
                return false;

            MemoryCache.Set(cacheKey, session, TimeSpan.FromMinutes(SessionsOptions.Value.CacheMinutes));
        }

        // If the issued at timestamp is greater than the token validation timestamp,
        // everything is fine. If not, it means that the token should be invalidated
        // as it is too old

        if (session == null)
            return false;

        return issuedAt > session.InvalidateTimestamp;
    }

    private async Task<OAuth2Authorization?> FetchDiscordDataAsync(string accessToken)
    {
        var httpClient = HttpClientFactory.CreateClient("discord");
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
        var responseMessage = await httpClient.GetAsync("/api/v10/oauth2/@me");
        var discordData =
            await responseMessage.Content.ReadFromJsonAsync<OAuth2Authorization>(SerializationContext.Default
                .Options);

        return discordData ?? null;
    }

    private record UserSession(DateTimeOffset InvalidateTimestamp);
}