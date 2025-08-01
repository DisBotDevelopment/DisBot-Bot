import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    Client,
    EmbedBuilder,
    MessageFlags,
    ModalBuilder,
    PermissionsBitField,
    TextChannel,
    TextInputBuilder,
    TextInputStyle,
    UserSelectMenuInteraction,
} from "discord.js";
import shortUUID from "short-uuid";
import {manageMessages, readMessageHistory, sendMessages, viewChannel,} from "../../../api/disbot-api.js";
import {convertToEmojiPng} from "../../../helper/emojis.js"
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";

export default {
    id: "ticket-selectmenu",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: UserSelectMenuInteraction, client: Client) {
        /*
        const message = await interaction.channel?.messages.fetch(
            interaction.message.id
        );

        const {guild} = interaction;

        for (const value of interaction.values) {


            const ticketmenusData = await database.ticketSetups.findFirst({
                where: {
                    GuildId: interaction.guild?.id,
                    CustomId: value,
                }
            });

            if (ticketmenusData?.ModalActiv == true) {
                if (
                    ticketmenusData.ModalOptions1?.Name !== null &&
                    ticketmenusData.ModalOptions2?.Name == null
                ) {
                    const type: number = Number(ticketmenusData.ModalOptions1?.Type);

                    const modal = new ModalBuilder();

                    const option1 = new TextInputBuilder();

                    modal
                        .setTitle(ticketmenusData.ModalName as string)
                        .setCustomId("ticket-menu-modal");

                    option1
                        .setLabel(ticketmenusData.ModalOptions1?.Name as string)
                        .setCustomId(ticketmenusData.CustomId as string)
                        .setPlaceholder(
                            ticketmenusData.ModalOptions1?.Placeholder as string
                        )
                        .setStyle(type)
                        .setRequired(true);

                    modal.addComponents(
                        new ActionRowBuilder<TextInputBuilder>().addComponents(option1)
                    );

                    interaction.showModal(modal);
                }

                if (
                    ticketmenusData.ModalOptions2?.Name !== null &&
                    ticketmenusData.ModalOptions3?.Name == null
                ) {
                    const type2: number = Number(ticketmenusData.ModalOptions2?.Type);
                    const type1: number = Number(ticketmenusData.ModalOptions1?.Type);

                    const modal = new ModalBuilder();

                    const option1 = new TextInputBuilder();
                    const option2 = new TextInputBuilder();

                    modal
                        .setTitle(ticketmenusData.ModalName as string)
                        .setCustomId("ticket-menu-modal");

                    option1
                        .setLabel(ticketmenusData.ModalOptions1?.Name as string)
                        .setCustomId(ticketmenusData.CustomId as string)
                        .setPlaceholder(
                            ticketmenusData.ModalOptions1?.Placeholder as string
                        )
                        .setStyle(type1)
                        .setRequired(true);
                    option2
                        .setLabel(ticketmenusData.ModalOptions2?.Name as string)
                        .setCustomId("ticket-modal-create-option2")
                        .setStyle(type2)
                        .setPlaceholder(
                            ticketmenusData.ModalOptions2?.Placeholder as string
                        )
                        .setRequired(true);

                    modal.addComponents(
                        new ActionRowBuilder<TextInputBuilder>().addComponents(option1),
                        new ActionRowBuilder<TextInputBuilder>().addComponents(option2)
                    );

                    interaction.showModal(modal);
                }

                if (
                    ticketmenusData.ModalOptions3?.Name !== null &&
                    ticketmenusData.ModalOptions4?.Name == null
                ) {
                    const type2: number = Number(ticketmenusData.ModalOptions2?.Type);
                    const type1: number = Number(ticketmenusData.ModalOptions1?.Type);
                    const type3: number = Number(ticketmenusData.ModalOptions3?.Type);

                    const modal = new ModalBuilder();

                    const option1 = new TextInputBuilder();
                    const option2 = new TextInputBuilder();
                    const option3 = new TextInputBuilder();

                    modal
                        .setTitle(ticketmenusData.ModalName as string)
                        .setCustomId("ticket-menu-modal");

                    option1
                        .setLabel(ticketmenusData.ModalOptions1?.Name as string)
                        .setCustomId(ticketmenusData.CustomId as string)
                        .setPlaceholder(
                            ticketmenusData.ModalOptions1?.Placeholder as string
                        )
                        .setStyle(type1)
                        .setRequired(true);
                    option2
                        .setLabel(ticketmenusData.ModalOptions2?.Name as string)
                        .setCustomId("ticket-modal-create-option2")
                        .setPlaceholder(
                            ticketmenusData.ModalOptions2?.Placeholder as string
                        )
                        .setStyle(type2)
                        .setRequired(true);
                    option3
                        .setLabel(ticketmenusData.ModalOptions3?.Name as string)
                        .setCustomId("ticket-modal-create-option3")
                        .setStyle(type3)
                        .setPlaceholder(
                            ticketmenusData.ModalOptions3?.Placeholder as string
                        )
                        .setRequired(true);

                    modal.addComponents(
                        new ActionRowBuilder<TextInputBuilder>().addComponents(option1),
                        new ActionRowBuilder<TextInputBuilder>().addComponents(option2),
                        new ActionRowBuilder<TextInputBuilder>().addComponents(option3)
                    );

                    interaction.showModal(modal);
                }

                if (
                    ticketmenusData.ModalOptions4?.Name !== null &&
                    ticketmenusData.ModalOptions5?.Name == null
                ) {
                    const type2: number = Number(ticketmenusData.ModalOptions2?.Type);
                    const type1: number = Number(ticketmenusData.ModalOptions1?.Type);
                    const type3: number = Number(ticketmenusData.ModalOptions3?.Type);
                    const type4: number = Number(ticketmenusData.ModalOptions4?.Type);

                    const modal = new ModalBuilder();

                    const option1 = new TextInputBuilder();
                    const option2 = new TextInputBuilder();
                    const option3 = new TextInputBuilder();
                    const option4 = new TextInputBuilder();

                    modal
                        .setTitle(ticketmenusData.ModalName as string)
                        .setCustomId("ticket-menu-modal");

                    option1
                        .setLabel(ticketmenusData.ModalOptions1?.Name as string)
                        .setCustomId(ticketmenusData.CustomId as string)
                        .setPlaceholder(
                            ticketmenusData.ModalOptions1?.Placeholder as string
                        )
                        .setStyle(type1)
                        .setRequired(true);
                    option2
                        .setLabel(ticketmenusData.ModalOptions2?.Name as string)
                        .setCustomId("ticket-modal-create-option2")
                        .setPlaceholder(
                            ticketmenusData.ModalOptions2?.Placeholder as string
                        )
                        .setStyle(type2)
                        .setRequired(true);
                    option3
                        .setLabel(ticketmenusData.ModalOptions3?.Name as string)
                        .setCustomId("ticket-modal-create-option3")
                        .setStyle(type3)
                        .setPlaceholder(
                            ticketmenusData.ModalOptions3?.Placeholder as string
                        )
                        .setRequired(true);
                    option4
                        .setLabel(ticketmenusData.ModalOptions4?.Name as string)
                        .setCustomId("ticket-modal-create-option4")
                        .setStyle(type4)
                        .setPlaceholder(
                            ticketmenusData.ModalOptions4?.Placeholder as string
                        )
                        .setRequired(true);

                    modal.addComponents(
                        new ActionRowBuilder<TextInputBuilder>().addComponents(option1),
                        new ActionRowBuilder<TextInputBuilder>().addComponents(option2),
                        new ActionRowBuilder<TextInputBuilder>().addComponents(option3),
                        new ActionRowBuilder<TextInputBuilder>().addComponents(option4)
                    );

                    interaction.showModal(modal);
                }

                if (ticketmenusData.ModalOptions5?.Name !== null) {
                    const type2: number = Number(ticketmenusData.ModalOptions2?.Type);
                    const type1: number = Number(ticketmenusData.ModalOptions1?.Type);
                    const type3: number = Number(ticketmenusData.ModalOptions3?.Type);
                    const type4: number = Number(ticketmenusData.ModalOptions4?.Type);
                    const type5: number = Number(ticketmenusData.ModalOptions5?.Type);

                    const modal = new ModalBuilder();

                    const option1 = new TextInputBuilder();
                    const option2 = new TextInputBuilder();
                    const option3 = new TextInputBuilder();
                    const option4 = new TextInputBuilder();
                    const option5 = new TextInputBuilder();

                    modal
                        .setTitle(ticketmenusData.ModalName as string)
                        .setCustomId("ticket-menu-modal");

                    option1
                        .setLabel(ticketmenusData.ModalOptions1?.Name as string)
                        .setCustomId(ticketmenusData.CustomId as string)
                        .setPlaceholder(
                            ticketmenusData.ModalOptions1?.Placeholder as string
                        )
                        .setStyle(type1)
                        .setRequired(true);
                    option2
                        .setLabel(ticketmenusData.ModalOptions2?.Name as string)
                        .setCustomId("ticket-modal-create-option2")
                        .setPlaceholder(
                            ticketmenusData.ModalOptions2?.Placeholder as string
                        )
                        .setStyle(type2)
                        .setRequired(true);
                    option3
                        .setLabel(ticketmenusData.ModalOptions3?.Name as string)
                        .setCustomId("ticket-modal-create-option3")
                        .setStyle(type3)
                        .setPlaceholder(
                            ticketmenusData.ModalOptions3?.Placeholder as string
                        )
                        .setRequired(true);
                    option4
                        .setLabel(ticketmenusData.ModalOptions4?.Name as string)
                        .setCustomId("ticket-modal-create-option4")
                        .setStyle(type4)
                        .setPlaceholder(
                            ticketmenusData.ModalOptions4?.Placeholder as string
                        )
                        .setRequired(true);
                    option5
                        .setLabel(ticketmenusData.ModalOptions5?.Name as string)
                        .setCustomId("ticket-modal-create-option5")
                        .setStyle(type5)
                        .setPlaceholder(
                            ticketmenusData.ModalOptions5?.Placeholder as string
                        )
                        .setRequired(true);

                    modal.addComponents(
                        new ActionRowBuilder<TextInputBuilder>().addComponents(option1),
                        new ActionRowBuilder<TextInputBuilder>().addComponents(option2),
                        new ActionRowBuilder<TextInputBuilder>().addComponents(option3),
                        new ActionRowBuilder<TextInputBuilder>().addComponents(option4),
                        new ActionRowBuilder<TextInputBuilder>().addComponents(option5)
                    );

                    interaction.showModal(modal);
                }
            }

            const fortickets = await database.ticketSetups.findMany({
                where: {
                    GuildId: interaction.guild?.id,
                    CustomId: value,
                }
            })


            for (const ticketSetupDocument of fortickets) {
                if (!ticketSetupDocument.CustomId) continue;
                if (!client.user) throw new Error("Client is not defined");
                if (!ticketSetupDocument)
                    interaction.reply({
                        content: `## ${await convertToEmojiPng(
                            "error",
                            client.user.id
                        )} Please select a valid ticket menu`,
                    });

                const blacklisted = interaction.guild?.members.cache.get(
                    interaction.user.id
                );

                if (
                    blacklisted?.roles.cache.has(
                        ticketSetupDocument.TicketBlackListRoles[0] as string
                    )
                ) {
                    await interaction.reply({
                        content: `## ${await convertToEmojiPng(
                            "error",
                            client.user.id
                        )} You are blacklisted from creating tickets in this Panel.`,
                        flags: MessageFlags.Ephemeral,
                    });

                    continue;
                }

                const rowbutton = new ActionRowBuilder<ButtonBuilder>().addComponents([
                    new ButtonBuilder()
                        .setCustomId("button-ticket-close")
                        .setEmoji("<:trash:1259432932234367069>")
                        .setLabel("Close Ticket")
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId("button-ticket-claim")
                        .setEmoji("<:support:1259853380885549117>")
                        .setLabel("Ticket Claim")
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId("button-ticket-look")
                        .setLabel("Ticket Lock")
                        .setEmoji("<:lock:1288527034519388222>")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("button-ticket-transscript")
                        .setLabel("Ticket Transccript")
                        .setEmoji("<:description:1321938426576109768>")
                        .setStyle(ButtonStyle.Secondary),
                ]);

                const rowbutton2 = new ActionRowBuilder<ButtonBuilder>().addComponents([
                    new ButtonBuilder()
                        .setCustomId("ticket-buttom-member-add")
                        .setLabel("Add User to Ticket")
                        .setEmoji("<:useradd:1288520279622025286>")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("ticket-buttom-member-remove")
                        .setLabel("Remove User from Ticket")
                        .setEmoji("<:userremove:1288520285666152448>")
                        .setStyle(ButtonStyle.Danger),
                ]);

                let messageData = await database.messageTemplates.findFirst({
                    where: {
                        Name: ticketmenusData?.MessageTempleateId,
                    }
                });

                if (!interaction.guild) throw new Error("Guild is not defined");
                if (!interaction.member) throw new Error("Member is not defined");
                if (!interaction.channel) throw new Error("Channel is not defined");
                if (!interaction.user) throw new Error("User is not defined");

                let embeddata = messageData?.Content
                    ? messageData?.Content?.replace(
                        "{guild.name}",
                        interaction.guild?.name
                    )
                        .replace("{guild.id}", interaction.guild?.id)
                        .replace("{member.name}", interaction.member.user.username)
                        .replace(
                            "{member.globalname}",
                            interaction?.user?.globalName as string
                        )
                        .replace(
                            "{member.displayname}",
                            interaction.user.displayName as string
                        )
                        .replace("{member.id}", interaction.user.id as string)
                        .replace("{member.tag}", `<@${interaction.user.id as string}>`)
                        .replace("{handlers.id}", ticketmenusData.Handlers[0] as string)
                        .replace("{handlers.tag}", `<@&${ticketmenusData.Handlers}>`)
                        .replace("{current.date}", Date)
                        .replace(
                            "https://i.imgur.com/kjEQRRI.png",
                            interaction.user.displayAvatarURL({extension: "png"})
                        )
                    : messageData?.EmbedJSON
                        ? messageData?.EmbedJSON?.replace(
                            "{guild.name}",
                            interaction.guild.name
                        )
                            .replace("{guild.id}", interaction.guild.id)
                            .replace("{member.name}", interaction.member.user.username)
                            .replace(
                                "{member.globalname}",
                                interaction.user.globalName as string
                            )
                            .replace(
                                "{member.displayname}",
                                interaction.user.displayName
                            )
                            .replace("{member.id}", interaction.user.id)
                            .replace("{member.tag}", `<@${interaction.user.id}>`)
                            .replace(
                                "{handlers.id}",
                                ticketmenusData?.Handlers[0] as string
                            )
                            .replace(
                                "{handlers.tag}",
                                `<@&${ticketmenusData?.Handlers}>`
                            )
                            .replace("{current.date}", Date())
                            .replace(
                                "https://i.imgur.com/kjEQRRI.png",
                                interaction.user.displayAvatarURL({extension: "png"})
                            )
                        : null;

                if (ticketmenusData?.IsThread == true) {
                    let channel;
                    const channelCategoryChecker = interaction.guild.channels.cache.get(
                        ticketmenusData?.CategoryId as string
                    );

                    if (channelCategoryChecker?.type == ChannelType.GuildCategory) {
                        channel = interaction.guild.channels.cache.get(
                            interaction.channel.id
                        );
                    } else {
                        channel = interaction.guild.channels.cache.get(
                            ticketmenusData?.CategoryId as string
                        );
                    }

                    if (!ticketmenusData.TicketChannelName)
                        throw new Error("Channel is not defined");

                    await (channel as TextChannel).threads
                        .create({
                            name: `${ticketmenusData?.TicketChannelName.replace(
                                "{guild.name}",
                                interaction.guild.name
                            )
                                .replace("{guild.id}", interaction.guild.id)
                                .replace("{member.name}", interaction.member.user.username)
                                .replace(
                                    "{member.globalname}",
                                    interaction.user.globalName as string
                                )
                                .replace(
                                    "{member.displayname}",
                                    interaction.user.displayName as string
                                )
                                .replace("{member.id}", interaction.user.id)
                                .replace(
                                    "{random.number}",
                                    Math.floor(Math.random() * 1000).toString()
                                )
                                .replace("{random.tag}", shortUUID.generate())
                                .replace(
                                    "{ticket.count}",
                                    (
                                        (await database.tickets.findMany({
                                            where: {
                                                SetupMessageId: interaction.message.id,
                                            },
                                        })).length + 1
                                    ).toString()
                                )}`,
                            type: ChannelType.PrivateThread,
                            reason: "Ticket System",
                        })
                        .then(async (thread) => {
                            interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setDescription(`## Ticket has Created <#${thread.id}>`)
                                        .setColor("#2B2D31"),
                                ],
                                flags: MessageFlags.Ephemeral,
                            });


                            database.tickets.create({
                                data: {
                                    GuildId: interaction.guildId,
                                    ThreadId: thread.id,
                                    IsClaimed: false,
                                    UserWhoHasClaimedId: null,
                                    Looked: false,
                                    TicketOwner: interaction.user.id,
                                    Handlers: ticketmenusData.Handlers[0],
                                    SetupChannelId: interaction.channelId,
                                    SetupMessageId: ticketmenusData.MessageId,
                                    TranscriptChannelId: ticketmenusData.TranscriptChannelId,
                                    TicketId: randomUUID(),
                                    TicketSetupId: ticketmenusData.CustomId
                                }
                            });

                            await thread.members.add(interaction.user.id);

                            const message = thread.send({
                                content: `<@&${ticketmenusData.Handlers}>`,
                            });
                            await (await message).delete();

                            if (!embeddata) {
                                thread.send({
                                    content: messageData.Content
                                        ? messageData.Content.replace(
                                            "{guild.name}",
                                            guild?.name as string
                                        )
                                            .replace(
                                                "{guild.id}",
                                                interaction.guild?.id as string
                                            )
                                            .replace(
                                                "{member.name}",
                                                interaction.user.username as string
                                            )
                                            .replace(
                                                "{member.globalname}",
                                                interaction.user.globalName as string
                                            )
                                            .replace(
                                                "{member.displayname}",
                                                interaction.user.displayName
                                            )
                                            .replace("{member.id}", interaction.user.id)
                                            .replace("{member.tag}", `<@${interaction.user.id}>`)
                                            .replace(
                                                "{handlers.id}",
                                                ticketmenusData.Handlers[0] as string
                                            )
                                            .replace(
                                                "{handlers.tag}",
                                                `<@&${ticketmenusData.Handlers}>`
                                            )
                                        : messageData?.Content
                                            ? messageData.Content.replace(
                                                "{guild.name}",
                                                guild?.name as string
                                            )
                                                .replace(
                                                    "{guild.id}",
                                                    interaction.guild?.id as string
                                                )
                                                .replace(
                                                    "{member.name}",
                                                    interaction.member?.user.username as string
                                                )
                                                .replace(
                                                    "{member.globalname}",
                                                    interaction.user.globalName as string
                                                )
                                                .replace(
                                                    "{member.displayname}",
                                                    interaction.user.displayName as string
                                                )
                                                .replace("{member.id}", interaction.user.id)
                                                .replace(
                                                    "{member.tag}",
                                                    `<@${interaction.user.id}>`
                                                )
                                                .replace(
                                                    "{handlers.id}",
                                                    ticketmenusData.Handlers[0] as string
                                                )
                                                .replace(
                                                    "{handlers.tag}",
                                                    `<@&${ticketmenusData.Handlers}>`
                                                )
                                            : "",

                                    components: [rowbutton, rowbutton2],
                                });
                            } else {
                                let embed = new EmbedBuilder(JSON.parse(embeddata));

                                thread.send({
                                    content: messageData.Content
                                        ? messageData.Content.replace(
                                            "{guild.name}",
                                            guild?.name as string
                                        )
                                            .replace(
                                                "{guild.id}",
                                                interaction.guild?.id as string
                                            )
                                            .replace("{member.name}", interaction.user.username)
                                            .replace(
                                                "{member.globalname}",
                                                interaction.user.globalName as string
                                            )
                                            .replace(
                                                "{member.displayname}",
                                                interaction.user.displayName as string
                                            )
                                            .replace("{member.id}", interaction.user.id)
                                            .replace("{member.tag}", `<@${interaction.user.id}>`)
                                            .replace(
                                                "{handlers.id}",
                                                ticketmenusData.Handlers[0] as string
                                            )
                                            .replace(
                                                "{handlers.tag}",
                                                `<@&${ticketmenusData.Handlers}>`
                                            )
                                        : messageData?.Content
                                            ? messageData.Content.replace(
                                                "{guild.name}",
                                                guild?.name as string
                                            )
                                                .replace(
                                                    "{guild.id}",
                                                    interaction.guild?.id as string
                                                )
                                                .replace(
                                                    "{member.name}",
                                                    interaction.user.username
                                                )
                                                .replace(
                                                    "{member.globalname}",
                                                    interaction.user.globalName as string
                                                )
                                                .replace(
                                                    "{member.displayname}",
                                                    interaction.user.displayName
                                                )
                                                .replace("{member.id}", interaction.user.id)
                                                .replace(
                                                    "{member.tag}",
                                                    `<@${interaction.user.id}>`
                                                )
                                                .replace(
                                                    "{handlers.id}",
                                                    ticketmenusData.Handlers[0] as string
                                                )
                                                .replace(
                                                    "{handlers.tag}",
                                                    `<@&${ticketmenusData.Handlers}>`
                                                )
                                            : "",
                                    embeds: [embed],
                                    components: [rowbutton, rowbutton2],
                                });
                            }
                        });

                    continue;
                } else {
                    if (!ticketmenusData?.TicketChannelName)
                        throw new Error("Channel is not defined");
                    await interaction.guild.channels
                        .create({
                            name: `${ticketmenusData.TicketChannelName.replace(
                                "{guild.name}",
                                interaction.guild.name
                            )
                                .replace("{guild.id}", interaction.guild.id)
                                .replace("{member.name}", interaction.member.user.username)
                                .replace(
                                    "{member.globalname}",
                                    interaction.user.globalName as string
                                )
                                .replace(
                                    "{member.displayname}",
                                    interaction.user.displayName
                                )
                                .replace("{member.id}", interaction.user.id)
                                .replace(
                                    "{random.number}",
                                    Math.floor(Math.random() * 1000).toString()
                                )
                                .replace("{random.tag}", shortUUID.generate())
                                .replace(
                                    "{ticket.count}",
                                    (
                                        (await database.tickets.findMany({
                                            where: {
                                                SetupMessageId: interaction.message.id,
                                            },
                                        })).length + 1
                                    ).toString()
                                )}`,
                            parent: ticketmenusData.CategoryId,
                            permissionOverwrites: [
                                {
                                    id: interaction.user.id,
                                    allow: [sendMessages, viewChannel, readMessageHistory],
                                },
                                {
                                    id: interaction.guild.id,
                                    deny: [viewChannel],
                                },
                                {
                                    id: ticketmenusData.Handlers[0] as string,
                                    allow: [
                                        sendMessages,
                                        viewChannel,
                                        readMessageHistory,
                                        manageMessages,
                                    ],
                                },
                                {
                                    id: client.user.id,
                                    allow: [PermissionsBitField.All],
                                },
                            ],
                        })
                        .then(async (channel) => {
                            interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setDescription(`## Ticket has Created ${channel}`)
                                        .setColor("#2B2D31"),
                                ],
                                flags: MessageFlags.Ephemeral,
                            });

                            database.tickets.create({
                                data: {
                                    GuildId: interaction.guildId,
                                    ChannelId: channel.id,
                                    IsClaimed: false,
                                    UserWhoHasClaimedId: null,
                                    Looked: false,
                                    TicketOwner: interaction.user.id,
                                    Handlers: ticketmenusData.Handlers[0],
                                    SetupChannelId: interaction.channelId,
                                    SetupMessageId: ticketmenusData.MessageId,
                                    TranscriptChannelId: ticketmenusData.TranscriptChannelId,
                                    AddedMemberIds: [],
                                    TicketId: randomUUID(),
                                    TicketSetupId: ticketmenusData.CustomId
                                }
                            });

                            if (ticketmenusData?.HasHandlersShadowPing) {
                                const message = channel.send({
                                    content: `<@&${ticketmenusData.Handlers}>`,
                                });

                                (await message).delete();
                            }

                            if (!embeddata) {
                                channel.send({
                                    content: messageData.Content
                                        ? messageData.Content.replace(
                                            "{guild.name}",
                                            guild?.name as string
                                        )
                                            .replace(
                                                "{guild.id}",
                                                interaction.guild?.id as string
                                            )
                                            .replace("{member.name}", interaction.user.username)
                                            .replace(
                                                "{member.globalname}",
                                                interaction.user.globalName as string
                                            )
                                            .replace(
                                                "{member.displayname}",
                                                interaction.user.displayName
                                            )
                                            .replace("{member.id}", interaction.user.id)
                                            .replace("{member.tag}", `<@${interaction.user.id}>`)
                                            .replace(
                                                "{handlers.id}",
                                                ticketmenusData.Handlers[0] as string
                                            )
                                            .replace(
                                                "{handlers.tag}",
                                                `<@&${ticketmenusData.Handlers}>`
                                            )
                                        : messageData?.Content
                                            ? messageData.Content.replace(
                                                "{guild.name}",
                                                guild?.name as string
                                            )
                                                .replace(
                                                    "{guild.id}",
                                                    interaction.guild?.id as string
                                                )
                                                .replace(
                                                    "{member.name}",
                                                    interaction.user.username
                                                )
                                                .replace(
                                                    "{member.globalname}",
                                                    interaction.user.globalName as string
                                                )
                                                .replace(
                                                    "{member.displayname}",
                                                    interaction.user.displayName
                                                )
                                                .replace("{member.id}", interaction.user.id)
                                                .replace(
                                                    "{member.tag}",
                                                    `<@${interaction.user.id}>`
                                                )
                                                .replace(
                                                    "{handlers.id}",
                                                    ticketmenusData.Handlers[0] as string
                                                )
                                                .replace(
                                                    "{handlers.tag}",
                                                    `<@&${ticketmenusData.Handlers}>`
                                                )
                                            : "",

                                    components: [rowbutton, rowbutton2],
                                });
                            } else {
                                let embed = new EmbedBuilder(JSON.parse(embeddata));

                                channel.send({
                                    content: messageData.Content
                                        ? messageData.Content.replace(
                                            "{guild.name}",
                                            guild?.name as string
                                        )
                                            .replace(
                                                "{guild.id}",
                                                interaction.guild?.id as string
                                            )
                                            .replace("{member.name}", interaction.user.username)
                                            .replace(
                                                "{member.globalname}",
                                                interaction.user.globalName as string
                                            )
                                            .replace(
                                                "{member.displayname}",
                                                interaction.user.displayName
                                            )
                                            .replace("{member.id}", interaction.user.id)
                                            .replace("{member.tag}", `<@${interaction.user.id}>`)
                                            .replace(
                                                "{handlers.id}",
                                                ticketmenusData.Handlers[0] as string
                                            )
                                            .replace(
                                                "{handlers.tag}",
                                                `<@&${ticketmenusData.Handlers}>`
                                            )
                                        : messageData?.Content
                                            ? messageData.Content.replace(
                                                "{guild.name}",
                                                guild?.name as string
                                            )
                                                .replace(
                                                    "{guild.id}",
                                                    interaction.guild?.id as string
                                                )
                                                .replace(
                                                    "{member.name}",
                                                    interaction.member?.user.username as string
                                                )
                                                .replace(
                                                    "{member.globalname}",
                                                    interaction?.user.globalName as string
                                                )
                                                .replace(
                                                    "{member.displayname}",
                                                    interaction?.user.displayName as string
                                                )
                                                .replace("{member.id}", interaction.user.id)
                                                .replace(
                                                    "{member.tag}",
                                                    `<@${interaction.user.id}>`
                                                )
                                                .replace(
                                                    "{handlers.id}",
                                                    ticketmenusData.Handlers[0] as string
                                                )
                                                .replace(
                                                    "{handlers.tag}",
                                                    `<@&${ticketmenusData.Handlers}>`
                                                )
                                            : "",
                                    embeds: [embed],
                                    components: [rowbutton, rowbutton2],
                                });
                            }
                        });
                }
            }
        }
        message?.edit({});
        */
    },
};
