using System.Text.Json.Serialization;

namespace DisBot.Shared.Models.GitHub;

public class GitHubTag
{
    [JsonPropertyName("name")]
    public string Name { get; set; }
}