using System.Text.Json.Serialization;

namespace Shared.Models.GitHub;

public class GitHubTag
{
    [JsonPropertyName("name")]
    public string Name { get; set; }
}