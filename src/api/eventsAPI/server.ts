import {Server, Socket} from 'socket.io';
import {EventAPIObject} from "../../types/eventAPI.js";
import {LoggingAction} from "../../enums/loggingTypes.js";
import {Logger} from "../../main/logger.js";
import {ExtendedClient} from '../../types/client.js';
import {database} from '../../main/database.js';
import {Config} from "../../main/config.js";

let io: Server;

interface AuthenticatedSocket extends Socket {
    data: {
        guilds?: string[];
        apiKey?: string;
    };
}

export async function setupSocketIO(client: ExtendedClient) {
    // Port configuration with fallbacks
    const apiPort = Config.Other.WsPort
        ? Number(Config.Other.WsPort) : 3459;

    io = new Server(apiPort);

    // Authentication middleware
    io.use(async (socket: AuthenticatedSocket, next) => {
        try {
            const apiKey = socket.handshake.auth.token ||
                socket.handshake.query.key as string;

            if (!apiKey) {
                console.warn(`Unauthorized connection attempt from ${socket.handshake.address}`);
                return next(new Error("Authentication required"));
            }

            const data = await database.apis.findFirst({
                where: {
                    Key: apiKey,
                },
                select: {
                    Guilds: true,
                    Key: true,
                },
            });
            if (!data || data.Key !== apiKey) {
                console.warn(`Invalid API key attempt: ${apiKey}`);
                return next(new Error("Invalid credentials"));
            }

            socket.data = {
                guilds: data.Guilds,
                apiKey: apiKey
            };


            next();
        } catch (error) {
            console.error('Authentication error:', error);
            next(new Error("Internal server error"));
        }
    });

    // Connection handling
    io.on('connection', (socket: AuthenticatedSocket) => {


        // Heartbeat monitoring
        let heartbeatInterval: NodeJS.Timeout;
        const setupHeartbeat = () => {
            heartbeatInterval = setInterval(() => {
                if (!socket.connected) return;
                socket.emit('ping');
            }, 30000); // 30 seconds
        };

        setupHeartbeat();

        socket.on('pong', () => {

            clearInterval(heartbeatInterval);
        });

        socket.on('disconnect', (reason) => {

            clearInterval(heartbeatInterval);
        });

        socket.on('error', (err) => {
            Logger.error(
                {
                    timestamp: new Date().toISOString(),
                    level: "error",
                    label: "EventsAPI",
                    message: `Socket error: ${err.message}`,
                    botType: Config.BotType.toString() || "Unknown",
                    action: LoggingAction.Other,
                }
            );
        });
    });
    return io;
}

export function broadcastEvent(event: EventAPIObject) {
    if (!io) {
        console.error('Broadcast attempted before Socket.IO initialization');
        throw new Error("Socket.IO not initialized");
    }

    const sendData = JSON.stringify(event);
    const startTime = Date.now();
    let sentCount = 0;


    io.sockets.sockets.forEach((socket: AuthenticatedSocket) => {
        if (socket.data.guilds?.includes(event.guildId)) {
            socket.emit('event', sendData, (ack: any) => {
                if (ack?.status === 'received') {
                    sentCount++;
                    Logger.info(
                        {
                            timestamp: new Date().toISOString(),
                            level: "info",
                            label: "EventsAPI",
                            message: `Event broadcasted to ${socket.id} for guild ${event.guildId}`,
                            botType: Config.BotType.toString() || "Unknown",
                            action: LoggingAction.Event,
                        }
                    );
                }
            });
        }
    });
}
