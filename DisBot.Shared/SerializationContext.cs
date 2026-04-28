using System.Text.Json;
using System.Text.Json.Serialization;
using DisBot.Dashboard.Configuration;
using DisBot.Shared.Http.Requests.User;
using DisBot.Shared.Http.Responses.Auth;
using DisBot.Shared.Http.Responses.Frontend;
using DisBot.Shared.Models.Discord;

namespace DisBot.Shared;

[JsonSerializable(typeof(CreateUserDto))]
[JsonSerializable(typeof(UpdateUserDto))]
[JsonSerializable(typeof(ClaimDto[]))]
[JsonSerializable(typeof(SchemeDto[]))]
[JsonSerializable(typeof(OAuth2Authorization))]
[JsonSerializable(typeof(BackendResponse))]

[JsonSourceGenerationOptions(JsonSerializerDefaults.Web)]
public partial class SerializationContext : JsonSerializerContext
{
    
}