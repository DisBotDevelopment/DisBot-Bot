using System.Text.Json;
using System.Text.Json.Serialization;
using DisBot.Shared.Http.Responses.Auth;
using DisBot.Shared.Http.Responses.Frontend;
using DisBot.Shared.Http.Responses.Guild;
using DisBot.Shared.Models.Discord;

namespace DisBot.Shared;

[JsonSerializable(typeof(ClaimDto[]))]
[JsonSerializable(typeof(SchemeDto[]))]
[JsonSerializable(typeof(OAuth2Authorization))]
[JsonSerializable(typeof(BackendResponse))]
[JsonSerializable(typeof(GuildDto))]

[JsonSourceGenerationOptions(JsonSerializerDefaults.Web)]
public partial class SerializationContext : JsonSerializerContext
{
    
}