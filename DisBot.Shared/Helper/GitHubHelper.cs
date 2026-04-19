using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using Shared.Models.GitHub;

namespace Shared.Helper;

public static class GitHubHelper
{
    public static readonly HttpClient HttpClient = new HttpClient();

    public static async Task<string> FetchLatestTag()
    {
        HttpClient.DefaultRequestHeaders.Add("User-Agent", "DisBot-Github Helper");
        var data = await HttpClient.GetFromJsonAsync<GitHubTag[]>(
            "https://api.github.com/repos/DisBotDevelopment/DisBot-Bot/tags");

        return data == null ? "??.??.??" : data[0].Name;
    }
}