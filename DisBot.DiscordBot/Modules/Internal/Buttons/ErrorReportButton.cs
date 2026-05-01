using DisBot.DiscordBot.Configuration;
using DisBot.Shared.Helper;
using Microsoft.Extensions.Options;
using NetCord;
using NetCord.Rest;
using NetCord.Services.ComponentInteractions;

namespace DisBot.DiscordBot.Modules.Internal.Buttons;

public class ErrorReportButton : ComponentInteractionModule<ButtonInteractionContext>
{
    private readonly IOptions<LoggingOptions> LoggingOptions;
    private readonly RestClient RestClient;
    private readonly IOptions<BotOptions> BotOptions;

    public ErrorReportButton(IOptions<LoggingOptions> options, IOptions<BotOptions> botOptions, RestClient restClient)
    {
        LoggingOptions = options;
        BotOptions = botOptions;
        RestClient = restClient;
    }

    [ComponentInteraction("internal.error.report")]
    public async Task<InteractionCallbackProperties<MessageOptions>> Button(string id)
    {
        var error = ReportHelper.Errors[id];
        await error.WithGitHub(LoggingOptions.Value.GitHubApiToken);

        var adminGuild = await RestClient.GetGuildAsync(BotOptions.Value.DiscordAdminGuildId);
        var channels = await adminGuild.GetChannelsAsync();
        if (channels.Where(channel => channel.Id == LoggingOptions.Value.ErrorReportForumId).Select(channel => channel)
                .FirstOrDefault() is not ForumGuildChannel forumChannel)
            return InteractionCallback.ModifyMessage(options => options.WithContent("No Forum Channel Found"));

        var channel = await forumChannel.CreateForumGuildThreadAsync(new ForumGuildThreadProperties(
            $"Error Report from {Context.User.Username} ({Context.User.Id})",
            new ForumGuildThreadMessageProperties
            {
                Flags = MessageFlags.IsComponentsV2,
                Components =
                [
                    new ComponentContainerProperties
                    {
                        // TODO: Add Emoji Manager
                        new TextDisplayProperties($"""
                                                   ### <:error:1366430438444236911> Error Report: {error.Title}
                                                   -# {error.Description}
                                                   """),
                        new ComponentSeparatorProperties(),
                        new TextDisplayProperties($"""
                                                   -# <:info:1260322428140130365> {error.Exception.Message}

                                                   ``` {error.Exception.StackTrace ?? "N/A"} ```
                                                   ** <:reply:1430577881205182555> Read more about the Error [@DisBotDevelopment/DisBot-Bot/issues]({error.GitHubIssueUrl})**
                                                   """)
                    }
                ]
            })
        {
            AppliedTags = LoggingOptions.Value.ErrorReportForumTags
        }, new RestRequestProperties());

        return InteractionCallback.ModifyMessage(options =>
        {
            options.WithComponents([
                new ComponentContainerProperties
                {
                    new TextDisplayProperties($"""
                                               -# <:GitHub:1395716087009509407> GitHub: [@DisBotDevelopment/DisBot-Bot/issues]({error.GitHubIssueUrl})
                                               -# View on Discord: [@{channel.Name}](https://discord.com/channels/{channel.GuildId}/{channel.Id}/{channel.Id})
                                               """)
                }
            ]);
        });
    }
}