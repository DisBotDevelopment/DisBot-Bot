using DisBot.Dashboard.Configuration;
using DisBot.Shared.Http.Responses.Frontend;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DisBot.Dashboard.Host.Controller;

[ApiController]
[Route("/config")]
public class FrontendController : ControllerBase
{
    private readonly IOptions<BackendOptions> BackendOptions;

    public FrontendController(IOptions<BackendOptions> backendOptions)
    {
        BackendOptions = backendOptions;
    }

    [HttpGet]
    public async Task<ActionResult<BackendResponse>> Get()
    {
        return new BackendResponse()
        {
            BackendUrl = BackendOptions.Value.ApiUrl
        };
    }
}