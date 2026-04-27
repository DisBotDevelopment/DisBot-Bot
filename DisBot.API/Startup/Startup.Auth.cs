using System.Security.Claims;
using DisBot.API.Configuration;
using DisBot.API.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace DisBot.API.Startup;

public static partial class Startup
{
    private static async Task InitialiseAuth(this WebApplicationBuilder builder)
    {
        builder.Services.AddAuthorization();

        builder.Services.AddScoped<UserAuthService>();
        
        var oidcOptions = builder.Configuration.GetSection("OAuth2").Get<OAuth2Options>();
        builder.Services.AddAuthentication("Discord")
            .AddCookie("Discord", "Discord", options =>
            {
                options.Events.OnSigningIn += async context =>
                {
                     var authService = context
                           .HttpContext
                           .RequestServices
                           .GetRequiredService<UserAuthService>();

                       var result = await authService.SyncAsync(context);

                       if (result)
                           context.Properties.IsPersistent = true;
                       else
                           context.Principal = new ClaimsPrincipal();
                };

                options.Events.OnValidatePrincipal += async context =>
                {
                    var authService = context
                        .HttpContext
                        .RequestServices
                        .GetRequiredService<UserAuthService>();

                    var result = await authService.ValidateAsync(context.Principal);

                    if (!result)
                        context.RejectPrincipal();
                };

                options.Cookie = new CookieBuilder()
                {
                    Name = "discord-session",
                    Path = "/",
                    IsEssential = true,
                    SecurePolicy = CookieSecurePolicy.SameAsRequest
                };
            })
            .AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, "Discord", options =>
            {
                var scopes = oidcOptions.Scopes ?? ["identify", "guilds", "openid"];
                options.Scope.Clear();
                foreach (var scope in scopes)
                {
                    options.Scope.Add(scope);
                }

                options.Authority = oidcOptions.Authority;
                options.RequireHttpsMetadata = oidcOptions.RequireHttpsMetadata;
                options.ClientId = oidcOptions.ClientId;
                options.ClientSecret = oidcOptions.ClientSecret;
                options.ResponseType = oidcOptions.ResponseType;
                options.SaveTokens = true;
                // options.CallbackPath = "/v1/auth/discord";
                
                options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "user_id");
                options.ClaimActions.MapJsonKey(ClaimTypes.Name, "username");
                
                options.GetClaimsFromUserInfoEndpoint = true;
            });
    }

    private static async Task LoadAuth(this WebApplication application)
    {
        application.UseAuthentication();
        application.UseAuthorization();
    }
}