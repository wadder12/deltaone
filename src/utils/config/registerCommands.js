import fs from 'fs';
import path from 'path';
import { REST, Routes } from 'discord.js';

function getCommandFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getCommandFiles(filePath, fileList);
        } else if (file.endsWith('.js')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

async function registerCommands(client) {
    const commandsPath = path.join(path.resolve(), 'src/commands');
    const commandFiles = getCommandFiles(commandsPath);
    const commands = [];

    for (const filePath of commandFiles) {
        const { command } = await import(filePath);
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

export { registerCommands };
