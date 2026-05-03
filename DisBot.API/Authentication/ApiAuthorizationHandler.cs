using System.Security.Claims;
using DisBot.API.Database;
using DisBot.Shared.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Namotion.Reflection;

namespace DisBot.API.Authentication;

public class ApiAuthorizationHandler : AuthorizationHandler<ApiRequirement>
{
    private readonly DataContext DataContext;

    public ApiAuthorizationHandler(DataContext dataContext)
    {
        DataContext = dataContext;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, ApiRequirement requirement)
    {
        if (context.Resource is DefaultHttpContext defaultHttpContext)
        {
            var guildId = "0";
            if (defaultHttpContext.Request.Path.ToString().Split('/').Length >= 4)
            {
                guildId = defaultHttpContext.Request.Path.ToString().Split('/')[3];
            }

            var data = new Dictionary<string, string>
            {
                { ApiAuthorizationPlaceholder.GuildId, guildId },
            };
            var permissions =
                ApiAuthorizationPlaceholder.ApplyAuthPlaceholder(requirement.Permission, data);

            // Api Key Auth
            if (defaultHttpContext.Request.Headers.TryGetValue("Authorization", out var value) &&
                !requirement.OnlyUser)
            {
                var apiKey = value.ToString();
                var apiEntity = DataContext.UserApis.Include(entity => entity.User)
                    .Where(entity => entity.Key.ToString() == apiKey)
                    .Select(entity => entity).FirstOrDefault();
                if (apiEntity != null && apiEntity.Permissions.ContainsAny(permissions))
                {
                    context.Succeed(requirement);
                    context.User.AddIdentity(new ClaimsIdentity(new List<Claim>()
                    {
                        new("UserId", apiEntity.User.DiscordUserId.ToString()),
                        new("ApiKey", apiKey)
                    }));
                    return Task.CompletedTask;
                }
            }

            switch (requirement.Type)
            {
                case "Guild":
                {
                    if (defaultHttpContext.Request.Path.HasProperty("guilds"))
                    {
                        // /api/guilds/:id
                        var userGuildPermission = DataContext.UserSharedGuilds
                            .Include(entity => entity.User)
                            .Include(entity => entity.Guild)
                            .FirstOrDefault(entity =>
                                entity.User.DiscordUserId == context.User.AuthenticatedUserId() &&
                                entity.Guild.DiscordGuildId == ulong.Parse(guildId)
                            );

                        if (userGuildPermission == null)
                        {
                            context.Fail();
                            return Task.CompletedTask;
                        }

                        if (userGuildPermission.Permissions.ContainsAny(permissions))
                        {
                            context.Succeed(requirement);
                            context.User.AddIdentity(new ClaimsIdentity(new List<Claim>()
                            {
                                new("UserId", context.User.AuthenticatedUserId().ToString()),
                            }));
                            return Task.CompletedTask;
                        }

                        // Owner Check
                        var guildEntity = DataContext.Guilds.Include(entity => entity.User)
                            .Where(entity =>
                                entity.User.DiscordUserId == context.User.AuthenticatedUserId() &&
                                entity.DiscordGuildId == ulong.Parse(guildId))
                            .Select(entity => entity)
                            .FirstOrDefault();
                        if (guildEntity != null)
                        {
                            context.Succeed(requirement);
                            context.User.AddIdentity(new ClaimsIdentity(new List<Claim>()
                            {
                                new("UserId", context.User.AuthenticatedUserId().ToString()),
                            }));
                            return Task.CompletedTask;
                        }
                    }
                }
                    break;
                case "User":
                {
                    var userEntity = DataContext.Users
                        .Where(entity => entity.DiscordUserId == context.User.AuthenticatedUserId())
                        .Select(entity => entity).FirstOrDefault();
                    if (userEntity != null)
                    {
                        if (requirement.Permission.Contains("user") ||
                            userEntity.Permissions.ContainsAny(permissions))
                        {
                            context.Succeed(requirement);
                            context.User.AddIdentity(new ClaimsIdentity(new List<Claim>()
                            {
                                new("UserId", context.User.AuthenticatedUserId().ToString()),
                            }));
                            return Task.CompletedTask;
                        }
                    }
                }
                    break;
                default:
                    context.Fail();
                    break;
            }
        }

        context.Fail();
        return Task.CompletedTask;
    }
}