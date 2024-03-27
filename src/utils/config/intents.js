// src/config/intents.js
import { GatewayIntentBits } from 'discord.js';

export const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
];
