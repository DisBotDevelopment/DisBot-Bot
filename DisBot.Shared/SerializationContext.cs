using System.Text.Json;
using System.Text.Json.Serialization;
using Shared.Models.Http.Requests;
using Shared.Models.Http.Responses.Auth;

namespace Shared;

[JsonSerializable(typeof(CreateUserDto))]
[JsonSerializable(typeof(UpdateUserDto))]
[JsonSerializable(typeof(ClaimDto[]))]
[JsonSerializable(typeof(SchemeDto[]))]

[JsonSourceGenerationOptions(JsonSerializerDefaults.Web)]
public partial class SerializationContext : JsonSerializerContext
{
    
}