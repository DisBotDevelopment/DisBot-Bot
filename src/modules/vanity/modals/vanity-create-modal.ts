import {ButtonStyle, MessageFlags, ModalSubmitInteraction, TextChannel} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";

export default {
    id: "vanity-create-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const query = interaction.fields.getTextInputValue("vanity");

        if (!client.user) throw new Error("Client is not ready");

        const data = await database.vanitys.findFirst({
            where: {
                Slug: query
            }
        });

        if (data) {
            return interaction.editReply({
                content: `## ${await convertToEmojiPng("link", client.user.id)} This vanity URL is already taken.`
            });
        }

        await interaction.guild?.invites
            .create(interaction.channel as TextChannel, {
                maxAge: 0,
                maxUses: 0
            })
            .then(async (invite) => {
                if (!client.user) throw new Error("Client is not ready");
                const uuid = randomUUID()
                await database.vanitys.create({
                    data: {
                        Slug: query,
                        Host: "dchat.click",
                        UserId: interaction.user.id,
                        UUID: randomUUID(),
                        Invite: invite.url,
                        GuildId: interaction.guildId,
                        CreatedAt: new Date(),
                        Analytics: {
                            connectOrCreate: {
                                create: {
                                    Click: 0,
                                    JoinedWithCode: 0,
                                    Latest30Days: {
                                        connectOrCreate: {
                                            create: {
                                                Click: 0,
                                                JoinedWithCode: 0,
                                                UniqueClick: 0,
                                                Date: new Date(),
                                            },
                                            where: {
                                                VanityAnalyticsId: uuid
                                            }
                                        }
                                    },
                                    LoggedIPs: [],
                                    TrackInviteWithLog: null,
                                    TrackMessageId: null,
                                    UniqueClick: 0,
                                    Update: new Date()
                                },
                                where: {
                                    VanityId: uuid
                                }
                            }
                        }
                    }
                });

                return interaction.editReply({
                    content: `## ${await convertToEmojiPng("link", client.user.id)}Your Vanity URL has been created. - [dchat.click/${query}](https://dchat.click/${query})`
                });
            });
    }
};
