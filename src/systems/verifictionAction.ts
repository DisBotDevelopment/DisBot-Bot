import {Client, GuildChannel, GuildMember, Interaction} from "discord.js";
import {VerificationAction, VerificationActionType} from "../enums/verification.js";
import {createCanvas} from "@napi-rs/canvas";
import {ExtendedClient} from "../types/client.js";
import {database} from "../main/database.js";

export async function verifyAction(
    member: GuildMember,
    action: VerificationAction,
    uuid: string,
    client?: ExtendedClient,
    interaction?: Interaction
) {
    const data = await database.verificationGates.findFirst({
        include: {
            ChannelPermissions: true
        },
        where: {
            UUID: uuid
        }
    });
    if (!data) {
        throw new Error("Verification gate not found.");
    }
    if (data.Active === false) {
        throw new Error("Verification gate is not active.");
    }

    const guildMember = member.guild.members.cache.get(member.id);


    if (action == VerificationAction.AddRole) {
        for (const roleId of data.Roles) {
            const role = member.guild.roles.cache.get(roleId);
            if (role) {
                if (!guildMember?.roles.cache.has(roleId)) {
                    await guildMember?.roles.add(role);
                } else {
                    await guildMember.roles.remove(role);
                }
            }
        }
    }
    if (action == VerificationAction.AddPermissionToChannel) {

        for (const permission of data.ChannelPermissions) {
            const channel = guildMember?.guild.channels.cache.get(permission.ChannelId);
            if (channel) {
                if (!channel.isTextBased()) continue;

                if ("permissionOverwrites" in channel) {
                    const permissionOverwrite = channel.permissionOverwrites.cache.get(guildMember?.id as string);
                    if (permissionOverwrite) {
                        await channel.permissionOverwrites.edit(guildMember?.id as string, {
                            [String(permission.Permission)]: null
                        });
                    } else {

                        await channel.permissionOverwrites.create(guildMember?.id as string, {
                            [String(permission.Permission)]: true
                        });
                    }
                }
            }
        }
    }

    const alreadyVerified = data.VerifiedUsers.includes(guildMember?.id as string);
    if (alreadyVerified) {
        await database.verificationGates.update(
            {
                where: {
                    UUID: uuid
                },
                data: {
                    VerifiedUsers: {
                        set: data.VerifiedUsers.filter((f) => f != guildMember.id)
                    }
                }
            }
        );
    } else {
        await database.verificationGates.update(
            {
                where: {
                    UUID: uuid
                },
                data: {
                    VerifiedUsers: {
                        push: guildMember.id
                    }
                }
            }
        );
    }

    return alreadyVerified;

}

export function generateCaptcha(): { code: string; imageBuffer: Buffer } {
    const code = randomText(5);
    const canvas = createCanvas(250, 100);
    const ctx = canvas.getContext("2d");

    // Hintergrund
    ctx.fillStyle = "#2c2f33";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Verzerrte Linien (Wellen)
    for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        ctx.moveTo(0, Math.random() * 100);
        for (let x = 0; x < canvas.width; x++) {
            const y = 50 + Math.sin(x / 10 + i) * (Math.random() * 10);
            ctx.lineTo(x, y + Math.random() * 5);
        }
        ctx.strokeStyle = randomRGBA(0.3);
        ctx.lineWidth = 1 + Math.random() * 1;
        ctx.stroke();
    }

    // Noise Punkte
    for (let i = 0; i < 1000; i++) {
        ctx.fillStyle = randomRGBA(0.1);
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }

    // Text verzerrt und überlappend zeichnen
    const letters = code.split("");
    let x = 20;

    for (const letter of letters) {
        ctx.save();
        const angle = (Math.random() - 0.5) * 1.5;
        const y = 50 + Math.random() * 20;

        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.font = `${28 + Math.random() * 10}px Sans`;
        ctx.fillStyle = randomRGBA(1);
        ctx.shadowColor = randomRGBA(0.5);
        ctx.shadowBlur = Math.random() * 5;

        ctx.fillText(letter, 0, 0);
        ctx.restore();

        x += 40 + Math.random() * 5;
    }

    return {code, imageBuffer: canvas.toBuffer("image/png")};
}

function randomText(length: number): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function randomRGBA(opacity: number): string {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},${opacity})`;
}