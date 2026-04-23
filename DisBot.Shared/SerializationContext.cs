using System.Text.Json;
using System.Text.Json.Serialization;
using DisBot.Shared.Http.Requests.User;
using DisBot.Shared.Http.Responses.Auth;

namespace DisBot.Shared;

[JsonSerializable(typeof(CreateUserDto))]
[JsonSerializable(typeof(UpdateUserDto))]
[JsonSerializable(typeof(ClaimDto[]))]
[JsonSerializable(typeof(SchemeDto[]))]

[JsonSourceGenerationOptions(JsonSerializerDefaults.Web)]
public partial class SerializationContext : JsonSerializerContext
{
    
}