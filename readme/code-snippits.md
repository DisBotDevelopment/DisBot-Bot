# Code Snippits

### Fix the cancas-node problem

- Download: https://ftp.gnome.org/pub/GNOME/binaries/win64/gtk+/2.22/gtk+-bundle_2.22.1-20101229_win64.zip
- https://github.com/nodejs/node-gyp#on-windows
- https://github.com/Automattic/node-canvas/wiki/Installation:-Windows

Downlaod the .zip file and put it into the `C:\GTK`.<br >
You need windos Visual Studio 2019 or newer and `Desktop development with C++` (ca. 10GB)

### Default logger example

```
        Logger.info(
            {
                guildId: "0",
                userId: "0",
                channelId: "0",
                messageId: "0",
                timestamp: new Date().toISOString(),
                level: "info",
                label: "General",
                message: `DisBot is ready! Version: ${botData.version}`,
                botType: Config.BotType || "Unknown",
                action: LoggingAction.Event,
            }
        );
```
