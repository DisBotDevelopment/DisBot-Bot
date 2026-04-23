using System.Security.Claims;
using DisBot.API.Configuration;
using DisBot.API.Database;
using DisBot.Shared.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace DisBot.API.Services;

public class UserAuthService
{
    private readonly IMemoryCache MemoryCache;
    private readonly ILogger<UserAuthService> Logger;
    private readonly DataContext DataContext;
    private readonly IOptions<SessionsOptions> SessionsOptions;

    private const string UserIdClaim = "UserId";
    private const string IssuedAtClaim = "IssuedAt";
    private const string CacheKeyFormat = $"{nameof(UserAuthService)}_{nameof(ValidateAsync)}_{{0}}";

    public UserAuthService(
        ILogger<UserAuthService> logger,
        DataContext dataContext,
        IOptions<SessionsOptions> sessionsOptions,
        IMemoryCache memoryCache
    )
    {
        DataContext = dataContext;
        Logger = logger;
        SessionsOptions = sessionsOptions;
        MemoryCache = memoryCache;
    }

    public async Task<bool> SyncAsync(ClaimsPrincipal? principal)
    {
        if (principal is null)
            return false;

        var username = principal.FindFirstValue(ClaimTypes.Name);
        var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(userId))
        {
            Logger.LogWarning("Unable to sync user to database as name and/or email claims are missing");
            return false;
        }

        var user = await DataContext.Users
            .FirstOrDefaultAsync(user => user.UserId == ulong.Parse(userId));

        if (user == null) // Sync user if not already existing in the database
        {
            var createdUser = await DataContext.Users.AddAsync(new UserEntity
            {
                Username = username,
                UserId = ulong.Parse(userId),
                AccessToken = "",
                RefreshToken = "",
                InvalidateTimestamp = DateTimeOffset.UtcNow.AddMinutes(-1)
            });
            await DataContext.SaveChangesAsync();
            user = createdUser.Entity;
        }
        else // Update properties of existing user
        {
            user.Username = username;
            user.AccessToken = "";
            user.RefreshToken = "";
            await DataContext.SaveChangesAsync();
        }

        principal.Identities.First().AddClaims([
            new Claim(UserIdClaim, user.UserId.ToString()),
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

        if (!int.TryParse(userIdString, out var userId))
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
                .Where(user => user.UserId == ulong.Parse(userId.ToString()))
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

    private record UserSession(DateTimeOffset InvalidateTimestamp);
}