using DisBot.Shared.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace DisBot.API.Authentication;

public class ApiAuthorizationPolicyProvider : IAuthorizationPolicyProvider
{
    private DefaultAuthorizationPolicyProvider FallbackPolicyProvider { get; }
    private const string POLICY_PREFIX = "Api";

    public ApiAuthorizationPolicyProvider(IOptions<AuthorizationOptions> options)
    {
        FallbackPolicyProvider = new DefaultAuthorizationPolicyProvider(options);
    }

    public Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
    {
        if (!policyName.StartsWith(POLICY_PREFIX, StringComparison.OrdinalIgnoreCase))
            return FallbackPolicyProvider.GetPolicyAsync(policyName);
        var policy = new AuthorizationPolicyBuilder();
        policy.AddRequirements(new ApiRequirement(
            policyName.Split(":")[2].Split(","),
            policyName.Split(":")[1],
            bool.Parse(policyName.Split(":")[3])
        ));
        return Task.FromResult(policy.Build());
    }

    public Task<AuthorizationPolicy> GetDefaultPolicyAsync() => FallbackPolicyProvider.GetDefaultPolicyAsync();

    public Task<AuthorizationPolicy?> GetFallbackPolicyAsync() => FallbackPolicyProvider.GetPolicyAsync("Api");
}