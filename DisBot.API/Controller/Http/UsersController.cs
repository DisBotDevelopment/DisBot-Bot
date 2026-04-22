using DisBot.API.Database;
using DisBot.API.Mapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shared.Entities.Users;
using Shared.Http.Requests;
using Shared.Http.Requests.User;
using Shared.Http.Responses;
using Shared.Http.Responses.User;

namespace DisBot.API.Controller.Http;

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

    [HttpGet]
    public async Task<ActionResult<PagedData<UserDto>>> GetAsync(
        [FromQuery] int startIndex,
        [FromQuery] int length
    )
    {
        // Validation
        if (startIndex < 0)
            return Problem("Invalid start index specified", statusCode: 400);

        if (length is < 1 or > 100)
            return Problem("Invalid length specified");

        var query = DataContext.Users.AsSingleQuery();

        // Pagination
        var data = await query
            .OrderBy(x => x.Id)
            .Skip(startIndex)
            .Take(length)
            .ProjectToDto()
            .ToArrayAsync();

        var total = await query.CountAsync();

        return new PagedData<UserDto>(data, total);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDto>> GetAsync([FromRoute] int id)
    {
        var user = await DataContext.Users
            .FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
            return Problem("No user with this id found", statusCode: 404);

        return UserMapper.ToDto(user);
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateAsync([FromBody] CreateUserDto request)
    {
        var user = UserMapper.ToEntity(request);
        user.InvalidateTimestamp = DateTimeOffset.UtcNow.AddMinutes(-1);

        var finalUser = await DataContext.Users.AddAsync(user);

        return UserMapper.ToDto(finalUser.Entity);
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<UserDto>> UpdateAsync([FromRoute] int id, [FromBody] UpdateUserDto request)
    {
        var user = await DataContext.Users
            .FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
            return Problem("No user with this id found", statusCode: 404);

        UserMapper.Merge(user, request);
        await DataContext.SaveChangesAsync();

        return UserMapper.ToDto(user);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteAsync([FromRoute] int id)
    {
        var user = await DataContext.Users
            .FirstOrDefaultAsync(user => user.Id == id);

        if (user == null)
            return Problem("No user with this id found", statusCode: 404);

        DataContext.Users.Remove(user);
        await DataContext.SaveChangesAsync();
        return NoContent();
    }
}