using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using NetCord;
using NetCord.Gateway;
using NetCord.Hosting.Gateway;
using NetCord.Hosting.Services;
using NetCord.Hosting.Services.ApplicationCommands;
using NetCord.Hosting.Services.ComponentInteractions;
using NetCord.Services.ComponentInteractions;
using Shared.Helper;

namespace DisBot.DiscordBot.Startup;

public static partial class Startup
{
    private static async Task InitialiseBot(this HostApplicationBuilder builder)
    {
        var version = await GitHubHelper.FetchLatestTag();

        builder.Services
            .AddApplicationCommands()
            .AddDiscordShardedGateway(options =>
            {
                options.Token = builder.Configuration.GetSection("Bot").GetValue<string>("DiscordApplicationToken");
                options.Presence = new PresenceProperties(UserStatusType.Online)
                {
                    StatusType = UserStatusType.Online,
                    Afk = false,
                    Activities =
                    [
                        new UserActivityProperties("Status", UserActivityType.Custom)
                        {
                            Name = "Status",
                            State = $"🎨 DisBot v2 - ({version})",
                            Emoji = EmojiProperties.Custom(1495167953971450037)
                        }
                    ]
                };
                options.Intents = GatewayIntents.All
                                  | GatewayIntents.DirectMessageReactions
                                  | GatewayIntents.GuildMessageReactions
                                  | GatewayIntents.Guilds
                                  | GatewayIntents.GuildPresences
                                  | GatewayIntents.GuildVoiceStates
                                  | GatewayIntents.GuildMessages
                                  | GatewayIntents.DirectMessages
                                  | GatewayIntents.MessageContent;
            })
            .AddComponentInteractions<ButtonInteraction, ButtonInteractionContext>()
            .AddComponentInteractions<StringMenuInteraction, StringMenuInteractionContext>()
            .AddComponentInteractions<UserMenuInteraction, UserMenuInteractionContext>()
            .AddComponentInteractions<RoleMenuInteraction, RoleMenuInteractionContext>()
            .AddComponentInteractions<MentionableMenuInteraction, MentionableMenuInteractionContext>()
            .AddComponentInteractions<ChannelMenuInteraction, ChannelMenuInteractionContext>()
            .AddComponentInteractions<ModalInteraction, ModalInteractionContext>()
            .AddShardedGatewayHandlers(typeof(Program).Assembly);
    }

    private static async Task LoadBot(this IHost host)
    {
        host.AddModules(typeof(Program).Assembly);
    }
}