using System.Text.Json.Serialization;

namespace DisBot.Shared.Models.Discord;

public class OAuth2Authorization
{
    [JsonPropertyName("application")]
    public OAuth2AuthorizationApplication Application { get; set; }
    [JsonPropertyName("copes")]
    public List<string> Scopes { get; set; }
    [JsonPropertyName("expires")]
    public DateTime Expires { get; set; }
    [JsonPropertyName("user")]
    public OAuth2AuthorizationUser User { get; set; }
}

public class OAuth2AuthorizationApplication
{
    [JsonPropertyName("id")]
    public string Id { get; set; }
    [JsonPropertyName("name")]
    public string Name { get; set; }
    [JsonPropertyName("icon")]
    public string Icon { get; set; }
    [JsonPropertyName("description")]
    public string Description { get; set; }
    [JsonPropertyName("hook")]
    public bool Hook { get; set; }
    [JsonPropertyName("bot_public")]
    public bool BotPublic { get; set; }
    [JsonPropertyName("bot_require_code_grant")]
    public bool BotRequireCodeGrant { get; set; }
    [JsonPropertyName("verify_key")]
    public string VerifyKey { get; set; }
}

public class OAuth2AuthorizationUser
{
    [JsonPropertyName("id")]
    public string Id { get; set; }
    [JsonPropertyName("username")]
    public string Username { get; set; }
    [JsonPropertyName("avatar")]
    public string Avatar { get; set; }
    [JsonPropertyName("discriminator")]
    public string Discriminator { get; set; }
    [JsonPropertyName("global_name")]
    public string GlobalName { get; set; }
    [JsonPropertyName("public_flags")]
    public int PublicFlags { get; set; }
}

