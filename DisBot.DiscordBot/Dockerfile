FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["DisBot.DiscordBot/DisBot.DiscordBot.csproj", "DisBot.DiscordBot/"]
COPY ["DisBot.Shared/DisBot.Shared.csproj", "DisBot.Shared/"]
RUN dotnet restore "DisBot.DiscordBot/DisBot.DiscordBot.csproj"
COPY . .
WORKDIR "/src/DisBot.DiscordBot"
RUN dotnet build "./DisBot.DiscordBot.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./DisBot.DiscordBot.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=build /src/DisBot.DiscordBot/Resources ./Resources/
ENTRYPOINT ["dotnet", "DisBot.DiscordBot.dll"]
