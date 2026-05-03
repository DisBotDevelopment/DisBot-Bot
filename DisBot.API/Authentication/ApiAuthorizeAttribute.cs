using DisBot.Shared.Enums;
using Microsoft.AspNetCore.Authorization;

namespace DisBot.API.Authentication;

public class ApiAuthorizeAttribute : AuthorizeAttribute
{
    private const string POLICY_PREFIX = "Api";

    public ApiAuthorizeAttribute(string[] permission, ApiAuthorizationType type, bool onlyUser = false)
    {
        Policy = $"{POLICY_PREFIX}:{type}:{string.Join(",", permission)}:{onlyUser}";
    }
}