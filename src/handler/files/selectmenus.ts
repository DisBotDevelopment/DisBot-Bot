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
export async function loadSelectMenus(client: ExtendedClient): Promise<void> {
  try {
    client.selectmenus?.clear();

    const modulesFolder = path.join(process.cwd(), ".build", "src", "modules");
    if (!fs.existsSync(modulesFolder)) {
      console.warn("Modules folder does not exist.".red);
      return;
    }

    // Alle Unterordner in modules/ durchsuchen
    const moduleDirectories = fs.readdirSync(modulesFolder, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    let totalSelectMenus = 0;

    for (const moduleDir of moduleDirectories) {
      const selectmenuFolder = path.join(modulesFolder, moduleDir, "selectmenus");

      if (!fs.existsSync(selectmenuFolder)) {
        continue; // Skip if no selectmenu folder exists
      }

      const selectmenuFiles = getFilesRecursively(selectmenuFolder, [".js"]);

      for (const filePath of selectmenuFiles) {
        const fileName = path.basename(filePath, ".js");
        try {

          const moduleUrl = pathToFileURL(filePath).href;
          const module = await import(moduleUrl);
          const selectmenu = module.default ?? module;

          if (!selectmenu.id) {
            console.error(`${fileName || "UNKNOWN"}`.yellow, `❗ FAILED`.red, "Missing an id.");
            continue;
          }

          client.selectmenus?.set(selectmenu.id, selectmenu);
          totalSelectMenus++;
        } catch (error) {
          Logger?.error({
            timestamp: new Date().toISOString(),
            level: "error",
            label: "SelectMenuHandler",
            message: `Failed to load selectmenu file: ${fileName || "UNKNOWN"} from module: ${moduleDir}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.SelectMenu,
          });
          continue;
        }
      }
    }



    Logger?.info({
      timestamp: new Date().toISOString(),
      level: "info",
      label: "SelectMenuHandler",
      message: `Loaded ${totalSelectMenus} selectmenu(s) from ${moduleDirectories.length} module(s)`,
      botType: Config.BotType.toString() || "Unknown",
      action: LoggingAction.SelectMenu,
    });
  } catch (error) {
    Logger?.error({
      timestamp: new Date().toISOString(),
      level: "error",
      label: "SelectMenuHandler",
      message: `Error loading selectmenus: ${error instanceof Error ? error.message : String(error)}`,
      botType: Config.BotType.toString() || "Unknown",
      action: LoggingAction.SelectMenu,
    });
  }
}