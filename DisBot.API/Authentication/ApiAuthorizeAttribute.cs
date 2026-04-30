using DisBot.Shared.Enums;
using Microsoft.AspNetCore.Authorization;

namespace DisBot.API.Authentication;

public class ApiAuthorizeAttribute : AuthorizeAttribute
{
    private const string POLICY_PREFIX = "Api";

    /**
     * Please use the ApiAuthorizationType class.
     */
    public ApiAuthorizeAttribute(string permission, ApiAuthorizationType type, bool onlyUser = false)
    {
        Policy = $"{POLICY_PREFIX}:{type}:{permission}:{onlyUser}";
    }
}