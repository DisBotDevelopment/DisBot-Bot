import {ButtonStyle, MessageFlags, ModalSubmitInteraction, TextChannel} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "vanity-create-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const query = interaction.fields.getTextInputValue("vanity");
        const data = await database.vanitys.findFirst({
            where: {
                Slug: query
            }
        });

        if (data) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("link")} This vanity URL is already taken.`, interaction, true)
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
                        Host: "dchat.link",
                        UserId: interaction.user.id,
                        UUID: uuid,
                        Invite: invite.url,
                        GuildId: interaction.guildId,
                        CreatedAt: new Date(),
                        InDiscovery: false,
                        IsBannedFromDiscover: false,
                        Embed: {
                            connectOrCreate: {
                                where: {
                                    VanityId: uuid
                                },
                                create: {
                                    Title: interaction.guild.name ?? "N/A",
                                    Description: interaction.guild.description ?? "N/A",
                                    Color: "#282b30",
                                    Author: {
                                        connectOrCreate: {
                                            where: {
                                                VanityEmbedsId: uuid
                                            },
                                            create: {
                                                Name: interaction.guild.name,
                                                URL: `https://dchat.link/${query}`,
                                                IconURL: interaction.guild.iconURL()
                                            }
                                        }
                                    }
                                }
                            }
                        },
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

                return await sendDefaultMessage(`## ${await convertToEmojiToPng("link")} Your Vanity URL has been created. - [dchat.link/${query}](https://dchat.link/${query})\n-# More Settings behind the Manage Button.`, interaction, true)
            });
    }
};
