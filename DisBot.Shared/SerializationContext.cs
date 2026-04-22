using System.Text.Json;
using System.Text.Json.Serialization;
using Shared.Http.Requests.User;
using Shared.Http.Responses.Auth;

namespace Shared;

[JsonSerializable(typeof(CreateUserDto))]
[JsonSerializable(typeof(UpdateUserDto))]
[JsonSerializable(typeof(ClaimDto[]))]
[JsonSerializable(typeof(SchemeDto[]))]

[JsonSourceGenerationOptions(JsonSerializerDefaults.Web)]
public partial class SerializationContext : JsonSerializerContext
{
    
}