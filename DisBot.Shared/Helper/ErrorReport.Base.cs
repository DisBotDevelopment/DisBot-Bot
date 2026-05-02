using System.Net.Http.Json;
using System.Text.Json.Serialization;

namespace DisBot.Shared.Helper;

public partial class ErrorReport
{
}

public partial class ErrorReport(string id, Exception e, string title, string description)
{
    public string Id => id;
    public Exception Exception { get; } = e;
    public string Title { get; } = title ?? "DisBot Exception";
    public string Description { get; } = description ?? "Failed to execute action or process.";
    public string? GitHubIssueUrl { get; private set; } = null;

    public async Task WithGitHub(string token)
    {
        var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
        httpClient.DefaultRequestHeaders.Add("X-GitHub-Api-Version", "2026-03-10");
        httpClient.DefaultRequestHeaders.Add("User-Agent", "DisBot-Github Helper");
        var response =
            await httpClient.PostAsJsonAsync("https://api.github.com/repos/DisBotDevelopment/DisBot-Bot/issues", new
            {
                title = Title,
                body = Description,
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
    }

    private class GithubIssueResponse
    {
        [JsonPropertyName("html_url")] public string HtmlUrl { get; set; }
    }
}