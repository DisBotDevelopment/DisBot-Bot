using System.Diagnostics.CodeAnalysis;
using Riok.Mapperly.Abstractions;
using Shared.Entities.Users;
using Shared.Http.Requests.User;
using Shared.Http.Responses.User;

namespace DisBot.API.Mapper;

[Mapper]
[SuppressMessage("Mapper", "RMG020:No members are mapped in an object mapping")]
[SuppressMessage("Mapper", "RMG012:No members are mapped in an object mapping")]
public static partial class UserMapper
{
    public static partial IQueryable<UserDto> ProjectToDto(this IQueryable<UserEntity> users);
    
    
    public static partial void Merge([MappingTarget] UserEntity user, UpdateUserDto request);

    
    public static partial UserDto ToDto(UserEntity user);
    
    public static partial UserEntity ToEntity(CreateUserDto request);
}