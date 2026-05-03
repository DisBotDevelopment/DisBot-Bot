using DisBot.API.Authentication;
using DisBot.API.Database;
using DisBot.API.Mapper;
using DisBot.Shared;
using DisBot.Shared.Enums;
using DisBot.Shared.Extensions;
using DisBot.Shared.Http.Responses.Guild;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace DisBot.API.Controller.Http.Guilds;

[ApiController]
[ApiAuthorize([Permissions.UserPermissions.User, Permissions.UserPermissions.UsersGuildsSelection],
    ApiAuthorizationType.User)]
[Route("/v1/guilds")]
public class GuildController : ControllerBase
{
    private DataContext DataContext { get; set; }

    public GuildController(DataContext dataContext)
    {
        DataContext = dataContext;
    }

    [HttpGet]
    public async Task<GuildDto[]> GetGuilds()
    {
        var ownGuilds = DataContext.Guilds.Include(entity => entity.User)
            .Where(entity => entity.User.DiscordUserId == User.AuthenticatedUserId()).Select(entity => entity).ToDto();
        var addedGuilds = DataContext.UserSharedGuilds.Include(entity => entity.Guild)
            .Include(entity => entity.User).Where(entity => entity.User.DiscordUserId == User.AuthenticatedUserId())
            .Select(entity => entity.Guild);
        var data = ownGuilds.ToList();
        data.AddRange(addedGuilds.ToDto());
        return data.ToArray();
    }
}