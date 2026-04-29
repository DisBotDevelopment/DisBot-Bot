using DisBot.Shared.Enums;
using Microsoft.AspNetCore.Authorization;

namespace DisBot.API.Authentication;

public class ApiAuthorizeAttribute : AuthorizeAttribute
{
    private const string POLICY_PREFIX = "Api";

    public ApiAuthorizeAttribute(string permission, ApiAuthorizationType type, bool onlyUser = false)
    {
        Permission = permission;
        Type = type;
        OnlyUser = onlyUser;
    }

    private bool OnlyUser { get; set; }

    private ApiAuthorizationType Type { get; }

    public string Permission
    {
        get => Permission;
        set => Policy = $"{POLICY_PREFIX}:{Type.ToString()}:{value}:{OnlyUser}";
    }
}