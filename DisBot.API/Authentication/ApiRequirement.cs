using DisBot.Shared.Enums;
using Microsoft.AspNetCore.Authorization;

namespace DisBot.API.Authentication;

public class ApiRequirement : IAuthorizationRequirement
{
    public string Permission { get; private set; }
    public string Type { get; private set; }
    public bool OnlyUser { get; private set; }

    public ApiRequirement(string permission, string type, bool onlyUser)
    {
        Permission = permission;
        Type = type;
        OnlyUser = onlyUser;
    }
}