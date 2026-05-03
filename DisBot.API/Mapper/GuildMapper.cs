using System.Diagnostics.CodeAnalysis;
using System.Linq;
using DisBot.Shared.Entities.Guilds;
using DisBot.Shared.Http.Responses.Guild;
using Riok.Mapperly.Abstractions;

namespace DisBot.API.Mapper;

[Mapper]
[SuppressMessage("Mapper", "RMG020:No members are mapped in an object mapping")]
[SuppressMessage("Mapper", "RMG012:No members are mapped in an object mapping")]
public static partial class GuildMapper
{
    public static partial IQueryable<GuildDto> ToDto(this IQueryable<GuildEntity> guilds);
    public static partial GuildDto ToDto(GuildEntity guild);
}