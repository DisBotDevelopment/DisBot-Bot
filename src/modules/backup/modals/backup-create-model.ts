import "dotenv/config";
import backup from "../../../systems/backup/index.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiGif, convertToEmojiPng } from "../../../helper/emojis.js";
import { Guild, MessageFlags, ModalSubmitInteraction } from "discord.js";
import pkg from "short-uuid";
const { uuid } = pkg;

export default {
  id: "backup-create-modal",

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    if (!client.user) throw new Error("Client user not found");
    const uudis = uuid();

    const name = interaction.fields.getTextInputValue("name")
    const maxMessagesPerChannel = interaction.fields.getTextInputValue(
      "maxMessagesPerChannel"
    );
    const doNotBackup = interaction.fields.getTextInputValue("doNotBackup");
    const backupMembers = interaction.fields.getTextInputValue("backupMembers");

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    if (Number(maxMessagesPerChannel) <= 1) {
      return interaction.editReply({
        content: `## ${await convertToEmojiPng(
          "error",
          client.user.id
        )} Please enter a valid number for max messages per channel.`,
      });
    }

    if (
      doNotBackup.length > 1 &&
      (!doNotBackup.split(",").includes("bans") ||
        !doNotBackup.split(",").includes("roles") ||
        !doNotBackup.split(",").includes("emojis") ||
        !doNotBackup.split(",").includes("channels"))
    ) {
      return interaction.editReply({
        content: `## ${await convertToEmojiPng(
          "error",
          client.user.id
        )} Please enter a valid value for do not backup. (bans, roles, emojis, channels)`,
      });
    }

    let boolean = false;
    if (backupMembers !== "true" && backupMembers !== "false") {
      return interaction.editReply({
        content: `## ${await convertToEmojiPng(
          "error",
          client.user.id
        )} Please enter a valid value for backup members. (true or false)`,
      });
    }
    if (backupMembers == "true") {
      boolean = true;
    } else {
      boolean = false;
    }

    const list: string[] = [];
    doNotBackup.split(",").forEach((item) => {
      if (item.trim() === "bans") {
        list.push("bans");
      } else if (item.trim() === "roles") {
        list.push("roles");
      } else if (item.trim() === "emojis") {
        list.push("emojis");
      } else if (item.trim() === "channels") {
        list.push("channels");
      }
    });

    const options = {
      backupName: name,
      backupID: uudis,
      maxMessagesPerChannel: Number(maxMessagesPerChannel) || 100,
      jsonSave: true,
      jsonBeautify: true,
      doNotBackup: list || [],
      backupMembers: boolean || false,
      saveImages: "",
    };

    const startTime = Date.now();

    if (!client.user) throw new Error("Client user not found");
    interaction.editReply({
      content: `## ${await convertToEmojiGif(
        "loading",
        client.user.id
      )} Creating backup and loading data...`,
      embeds: [],
      components: [],
    });

    backup
      .create(interaction.guild as Guild, options)
      .then(async (backupData: any) => {
        const endTime = Date.now();
        const time = endTime - startTime;

        if (!client.user) throw new Error("Client user not found");
        interaction.editReply({
          content: `## ${await convertToEmojiPng(
            "check",
            client.user.id
          )} Backup created successfully in ${Math.round(time / 1000)} seconds.`,
          embeds: [],
        });
      });
  },
};
