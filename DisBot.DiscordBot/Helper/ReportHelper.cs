using System.Net.Http.Json;
using System.Text.Json.Serialization;
using DisBot.DiscordBot.Services.Internal;
using NetCord;
using NetCord.Rest;

namespace DisBot.Shared.Helper;

public static class ReportHelper
{
    public static Dictionary<string, ErrorReport> Errors { get; } = new();

    public static ErrorReport Create(Exception e, string? title, string? description)
    {
        var id = Guid.NewGuid().ToString();
        var error = new ErrorReport(id, e, title ?? "DisBot Exception",
            description ?? "Failed to execute action or process...");
        Errors.Add(id, error);
        return error;
    }

    public class ErrorReport(string id, Exception e, string title, string description)
    {
        public Exception Exception { get; } = e;
        public string Title { get; } = title ?? "DisBot Exception";
        public string Description { get; } = description ?? "Failed to execute action or process.";
        public string? GitHubIssueUrl { get; private set; } = null;

        public async Task<ErrorReport> WithDiscord(Interaction interaction)
        {
            await interaction.SendResponseAsync(
                InteractionCallback.Message(
                    new InteractionMessageProperties()
                    {
                        Flags = MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                        Components =
                        [
                            new ComponentContainerProperties
                            {
                                new TextDisplayProperties($"## {title}"),
                                new TextDisplayProperties($"-# {description}"),
                                new ComponentSeparatorProperties(),
                                new TextDisplayProperties(
                                    $"||```cs\n// {Exception.Message}\n{Exception.StackTrace ?? "N/A"}```||"),
                                new ComponentSeparatorProperties(),
                                new ComponentSectionProperties(new ButtonProperties($"internal.error.report:{id}",
                                    "Report Error",
                                    EmojiProperties.Custom(1366426689961459893), ButtonStyle.Secondary))
                                {
                                    new TextDisplayProperties(
                                        $"-# Please read the error before you report it to the development Team."),
                                },
                                new ComponentSeparatorProperties(),
                                new ComponentSectionProperties(
                                    new LinkButtonProperties(
                                        "https://docs.disbot.app/doc/troubleshooting-8PWsSMRNvH",
                                        "Read More",
                                        EmojiProperties.Custom(1438974310042697909)))
                                {
                                    new TextDisplayProperties($"""
                                                               ### {EmojiService.Emojis["info"]} Follow this Steps!
                                                               -# **Steps you can do**
                                                               -# - Check your Action or Input.
                                                               -# - Check the Error Message and the Error Details below.
                                                               -# - Check Github and Discord for this problem.
                                                               -# - If there is no problem from you side and on Github or Discord then click \"Report Error\"
                                                               -# - Thanks for your Report - You will see a message with the Reports Liked.
                                                               """)
                                }
                            }
                        ]
                    }
                ));
            return this;
        }

        public async Task<ErrorReport> WithGitHub(string token)
        {
            var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
            httpClient.DefaultRequestHeaders.Add("X-GitHub-Api-Version", "2026-03-10");
            httpClient.DefaultRequestHeaders.Add("User-Agent", "DisBot-Github Helper");
            var response =
                await httpClient.PostAsJsonAsync("https://api.github.com/repos/DisBotDevelopment/DisBot-Bot/issues", new
                {
                    title = title,
                    body = description,
                    labels = new List<string>
                    {
                        "Automation", "Bug-Report"
                    },
                    assignees = new List<string>
                    {
                        "jesperrichert"
                    }
                });
            var data = await response.Content.ReadFromJsonAsync<GithubIssueResponse>();
            GitHubIssueUrl = data.HtmlUrl;
            return this;
        }
    }

    private class GithubIssueResponse
    {
        [JsonPropertyName("html_url")] public string HtmlUrl { get; set; }
    }
}