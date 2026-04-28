using DisBot.API.Services;
using DisBot.Shared.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi;

namespace DisBot.API.Controller.Http.General;

[ApiController]
[Route("/")]
public class IndexController : ControllerBase
{
    private readonly UserAuthService UserAuthService;

    public IndexController(UserAuthService userAuthService)
    {
        UserAuthService = userAuthService;
    }

    [HttpGet]
    public async Task<ActionResult<object>> Get()
    {
        return new
        {
            version = await GitHubHelper.FetchLatestTagAsync(),
            status = "ok",
            docs = "https://docs.disbot.app/doc/api-2xx3snx3sb",
        };
    }
}