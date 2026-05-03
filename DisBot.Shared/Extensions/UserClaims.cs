using System.Security.Claims;

namespace DisBot.Shared.Extensions;

public static class UserClaims
{
    public static ulong AuthenticatedUserId(this ClaimsPrincipal claimsPrincipal)
    {
        var userId = claimsPrincipal.Claims.Where(claim => claim.Type == "UserId").Select(claim => claim.Value)
            .FirstOrDefault();
        if (userId == null) return 0;
        return ulong.Parse(userId);
    }
}