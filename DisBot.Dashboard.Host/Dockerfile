FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release

# Install required packages
RUN apt-get update; apt-get install unzip -y; apt-get clean
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Build options
ARG BUILD_CONFIGURATION=Release

# Download npm packages
WORKDIR "/src/DisBot.Dashboard.Client/Styles"
COPY ["DisBot.Dashboard.Client/Styles/package.json", "package.json"]

RUN bun install

WORKDIR /src

COPY ["DisBot.Dashboard.Host/DisBot.Dashboard.Host.csproj", "DisBot.Dashboard.Host/"]
COPY ["DisBot.Dashboard.Client/DisBot.Dashboard.Client.csproj", "DisBot.Dashboard.Client/"]
COPY ["DisBot.Shared/DisBot.Shared.csproj", "DisBot.Shared/"]

RUN dotnet restore "DisBot.Dashboard.Client/DisBot.Dashboard.Client.csproj"
RUN dotnet restore "DisBot.Dashboard.Host/DisBot.Dashboard.Host.csproj"

COPY . .

WORKDIR "/src/DisBot.Dashboard.Client"
RUN dotnet build "./DisBot.Dashboard.Client.csproj" -c $BUILD_CONFIGURATION -o /app/build-frontend

WORKDIR "/src/DisBot.Dashboard.Client/Styles"
RUN bun run build

WORKDIR "/src/DisBot.Dashboard.Host"
RUN dotnet build "./DisBot.Dashboard.Host.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release

WORKDIR "/src/DisBot.Dashboard.Host"
RUN dotnet publish "./DisBot.Dashboard.Host.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

WORKDIR "/src/DisBot.Dashboard.Client"
RUN dotnet publish "./DisBot.Dashboard.Client.csproj" -c $BUILD_CONFIGURATION -o /app/publish-frontend /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=publish /app/publish-frontend/wwwroot ./wwwroot
ENTRYPOINT ["dotnet", "DisBot.Dashboard.Host.dll"]
