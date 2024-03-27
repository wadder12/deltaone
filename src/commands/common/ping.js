// src/commands/common/ping.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { sendErrorEmbed } from '../../utils/events/errorHandler';

const configPath = path.join(__dirname, '../../utils/config/config.json'); 
const { pingWebsite } = JSON.parse(fs.readFileSync(configPath, 'utf8'));

export const command = {
    data: new SlashCommandBuilder()
        .setName('pingme')
        .setDescription('checks the bot\'s latency to the API and a website.'),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const apiStart = Date.now();
            const webStart = Date.now();
            await axios.get(pingWebsite).then(() => {
                const webLatency = Date.now() - webStart;
                const apiLatency = Date.now() - apiStart; 
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF) 
                    .setTitle('Ping Results')
                    .addFields(
                        { name: 'API Latency', value: `${apiLatency}ms`, inline: true },
                        { name: 'Website Latency', value: `${webLatency}ms for ${pingWebsite}`, inline: true },
                    );
                interaction.editReply({ embeds: [embed] });
            });
        } catch (error) {
            console.error(error); 
            sendErrorEmbed(interaction, error);
        }
    },
};
