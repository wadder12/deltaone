// src/events/readyHandler.js
import { registerCommands } from '../config/registerCommands'; 

export async function setupReadyHandler(client) {
    client.once('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        await registerCommands(client); 
    });
}
