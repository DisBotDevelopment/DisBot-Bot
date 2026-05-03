using DisBot.API.Database;
using DisBot.API.Mapper;
using DisBot.Shared.Extensions;
using DisBot.Shared.Http.Responses.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DisBot.API.Controller.Http.Users;

[Authorize]
[ApiController]
[Route("v1/users")]
public class UsersController : Microsoft.AspNetCore.Mvc.Controller
{
    private readonly DataContext DataContext;

    public UsersController(DataContext dataContext)
    {
        DataContext = dataContext;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDto>> GetAsync([FromRoute] int id)
    {
        var user = await DataContext.Users
            .FirstOrDefaultAsync(x => x.DiscordUserId == User.AuthenticatedUserId());

        if (user == null)
            return Problem("No user with this id found", statusCode: 404);

        return UserMapper.ToDto(user);
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteAsync()
    {
        var user = await DataContext.Users
            .FirstOrDefaultAsync(user => user.DiscordUserId == User.AuthenticatedUserId());

        if (user == null)
            return Problem("No user with this id found", statusCode: 404);

        DataContext.Users.Remove(user);
        await DataContext.SaveChangesAsync();
        return NoContent();
    }
}