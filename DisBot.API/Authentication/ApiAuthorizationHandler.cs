using System.Diagnostics.CodeAnalysis;
using DisBot.API.Database;
using DisBot.Shared.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
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
            if (defaultHttpContext.Request.Headers.TryGetValue("Authorization", out var value) && !requirement.OnlyUser)
            {
                // Api Key Auth
                var apiKey = value.ToString();
                var apiEntity = DataContext.UserApis.Where(entity => entity.Key.ToString() == apiKey)
                    .Select(entity => entity).FirstOrDefault();
                if (apiEntity != null && apiEntity.Permissions.Contains(requirement.Permission))
                {
                    context.Succeed(requirement);
                }
            }
            else
            {
                // User Auth
                var userId = context.User.Claims.Where(claim => claim.Type == "UserId").Select(claim => claim.Value)
                    .FirstOrDefault();
                if (userId == null)
                {
                    context.Fail();
                    return Task.CompletedTask;
                }

                switch (requirement.Type)
                {
                    case ApiAuthorizationType.Guild:
                    {
                        var userGuildPermission = DataContext.UserApiGuildPermissions
                            .Include(entity => entity.User)
                            .FirstOrDefault(entity => entity.User.UserId == ulong.Parse(userId));
                        if (userGuildPermission == null)
                        {
                            context.Fail();
                            return Task.CompletedTask;
                        }

                        if (defaultHttpContext.Request.Path.HasProperty("guild"))
                        {
                            // /api/guild/:id
                            var guildId = defaultHttpContext.Request.Path.ToString().Split('/')[3];
                            if (guildId == userGuildPermission.GuildId.ToString())
                            {
                                if (userGuildPermission.Permissions.Contains(requirement.Permission))
                                {
                                    context.Succeed(requirement);
                                }
                            }
                            else
                            {
                                // Owner Check
                                var guildEntity = DataContext.Guilds.Include(entity => entity.User)
                                    .Where(entity =>
                                        entity.User.UserId == ulong.Parse(userId) &&
                                        entity.GuildId == ulong.Parse(guildId))
                                    .Select(entity => entity)
                                    .FirstOrDefault();
                                if (guildEntity != null)
                                {
                                    context.Succeed(requirement);
                                }
                            }
                        }
                    }
                        break;
                    case ApiAuthorizationType.User:
                    {
                        var userEntity = DataContext.Users.Where(entity => entity.UserId == ulong.Parse(userId))
                            .Select(entity => entity).FirstOrDefault();
                        if (userEntity != null)
                        {
                            if (requirement.Permission == "user" ||
                                userEntity.Permissions.Contains(requirement.Permission))
                            {
                                context.Succeed(requirement);
                            }
                        }
                    }
                        break;
                    default:
                        context.Fail();
                        break;
                }
            }
        }

        context.Fail();
        return Task.CompletedTask;
    }
}