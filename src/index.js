import 'dotenv/config';
import { Client } from 'discord.js';
import { intents } from './utils/config/intents';
import { setupInteractionCreateHandler } from './utils/config/interactionCreateHandler';
import { setupReadyHandler } from './utils/events/readyHandler';

const client = new Client({ intents });

client.commands = new Map();

// setup the event handlers
setupReadyHandler(client);
setupInteractionCreateHandler(client);

client.login(process.env.DISCORD_TOKEN);


/**
 * @author     : Andrew Wade
 * @copyright  : © 2024
 * @created    : 2023-03-24
 * @description: file is the entry point for the bot
 */