// const [action, uuid, currentIndexStr] = interaction.customId.split(":");
//         const currentIndex = parseInt(currentIndexStr) || 0;
//         const pageSize = 5;
//         const data1 = await autodeleteDB.find({ GuildId: interaction.guildId }).sort()
//         const data = data1.map((d) => d.DeleteSetups).flat();

//         const list = data.slice(currentIndex, currentIndex + 5);
//         const embedMessages = new TextDisplayBuilder()
//             .setContent(
//                 (await Promise.all(list.map(async (l) => `**Channel Name:** ${l.ChannelId ? `<#${l.ChannelId}>` : "N/A"}\n**UUID:** ${l.UUID}`))).join("\n\n")
//             );

//         const selectMenu = new StringSelectMenuBuilder()
//             .setCustomId("autodelete-manage-select")
//             .setPlaceholder("Select a Option to manage")
//             .addOptions(
//                 await Promise.all(list.map(async (l) => ({
//                     label: (await interaction.guild?.channels.fetch(l.ChannelId as string))?.name || "Unknown Channel",
//                     description: `UUID: ${l.UUID}`,
//                     value: l.UUID
//                 })) as any)
//             );

//         const paginationData: PaginationData = {
//             interaction: interaction,
//             paginationData: data,
//             buttonCustomId: "autodelete-manage",
//             selectmenu: selectMenu,
//             content: embedMessages,
//             pageSize: pageSize,
//             client: client,
//             currentIndex: currentIndex,
//             latestUUID: uuid
//         }

//         await PaginationBuilder(
//             paginationData
//         )