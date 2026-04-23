using DisBot.API.Configuration;
using DisBot.Shared.Configuration;
using DisBot.Shared.Helper;
using Scalar.AspNetCore;
using OAuth2Options = DisBot.API.Configuration.OAuth2Options;

namespace DisBot.API.Startup;

public partial class Startup
{
    private static async Task InitialiseBase(this WebApplicationBuilder builder)
    {
        builder.Services.AddControllers();
        builder.Services.AddOptions<SessionsOptions>().BindConfiguration("Sessions");
        builder.Services.AddOptions<DatabaseOptions>().BindConfiguration("Database");
        builder.Services.AddOptions<OAuth2Options>().BindConfiguration("OAuth2");
        builder.Services.AddOptions<SessionOptions>().BindConfiguration("Session");
        builder.Services.AddOpenApi();
        builder.Services.AddMemoryCache();
    }

    private static async Task LoadBase(this WebApplication application)
    {
        var version = await GitHubHelper.FetchLatestTagAsync();
        application.MapOpenApi();
        application.MapScalarApiReference("/v1/docs",
            options =>
            {
                options.WithTitle($"DisBot API - {version}");
                options.WithClassicLayout();
                options.ForceDarkMode();
                options.HideSearch();
                options.ShowOperationId();
                options.ExpandAllTags();
                options.SortTagsAlphabetically();
                options.SortOperationsByMethod();
                options.PreserveSchemaPropertyOrder();
            });
        application.MapControllers();
    }
}