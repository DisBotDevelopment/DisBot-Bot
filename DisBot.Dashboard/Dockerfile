FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["DisBot.Dashboard/DisBot.Dashboard.csproj", "DisBot.Dashboard/"]
RUN dotnet restore "DisBot.Dashboard/DisBot.Dashboard.csproj"
COPY . .
WORKDIR "/src/DisBot.Dashboard"
RUN dotnet build "./DisBot.Dashboard.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./DisBot.Dashboard.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DisBot.Dashboard.dll"]
