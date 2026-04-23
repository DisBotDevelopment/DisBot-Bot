using System.Diagnostics.CodeAnalysis;
using DisBot.Shared.Http.Requests.User;
using DisBot.Shared.Http.Responses.User;
using Riok.Mapperly.Abstractions;

namespace DisBot.Dashboard.Mappers;

[Mapper]
[SuppressMessage("Mapper", "RMG020:No members are mapped in an object mapping")]
[SuppressMessage("Mapper", "RMG012:No members are mapped in an object mapping")]
public static partial class UserMapper
{
    public static partial UpdateUserDto ToUpdate(UserDto dto);
}