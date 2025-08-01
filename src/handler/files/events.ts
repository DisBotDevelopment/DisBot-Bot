import colors from "colors";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { getFilesRecursively } from "../../helper/fileHelper.js";
import { ExtendedClient } from "../../types/client.js";
import { LoggingAction } from "../../enums/loggingTypes.js";
import { Logger } from "../../main/logger.js";
import {Config} from "../../main/config.js";

colors.enable();

/**
 * @param {ExtendedClient} client
 */
export async function loadEvents(client: ExtendedClient) {
  try {
    client.events?.clear();

    const modulesFolder = path.join(process.cwd(), ".build", "src", "modules");
    if (!fs.existsSync(modulesFolder)) {
      console.warn("Modules folder does not exist.".red);
      return;
    }

    const moduleDirectories = fs.readdirSync(modulesFolder, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    let totalEvents = 0;

    for (const moduleDir of moduleDirectories) {
      const eventFolder = path.join(modulesFolder, moduleDir, "events");

      if (!fs.existsSync(eventFolder)) {
        continue;
      }

      const eventFiles = getFilesRecursively(eventFolder, [".js"]);

      for (const filePath of eventFiles) {
        const fileName = path.basename(filePath, path.extname(filePath));

        try {
          const moduleUrl = pathToFileURL(filePath).href;
          const eventModule = await import(moduleUrl);
          const event = eventModule.default ?? eventModule;

          if (!event.name) {
            console.error(`${fileName || "UNKNOWN"}`.yellow, `❗ FAILED`.red, "Missing an event name.");
            continue;
          }

          if (!client.events) {
            throw new Error("Client events property not initialized.");
          }

          // Events
          client.events.set(event.name, event);

          if (event.options) {
            if (event.options.once == true) {

              client.once(event.name, (...args) => event.execute(...args, client))
              totalEvents++;
              continue;
            }
          }

          client.on(event.name, (...args) => event.execute(...args, client));
          totalEvents++;
        } catch (error) {
          Logger?.error({
            timestamp: new Date().toISOString(),
            level: "error",
            label: "EventHandler",
            message: `Failed to load event file: ${fileName || "UNKNOWN"} from module: ${moduleDir} with ${error}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Event,
          });
          continue;
        }
      }
    }

    Logger?.info({
      timestamp: new Date().toISOString(),
      level: "info",
      label: "EventHandler",
      message: `Loaded ${totalEvents} event(s) from ${moduleDirectories.length} module(s)`,
      botType: Config.BotType.toString() || "Unknown",
      action: LoggingAction.Event,
    });
  } catch (error) {
    Logger?.error({
      timestamp: new Date().toISOString(),
      level: "error",
      label: "EventHandler",
      message: `Error loading events: ${error instanceof Error ? error.message : String(error)}`,
      botType: Config.BotType.toString() || "Unknown",
      action: LoggingAction.Event,
    });
  }
}