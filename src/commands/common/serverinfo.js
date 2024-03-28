// src/commands/common/serverinfo.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { sendErrorEmbed } from '../../utils/events/errorHandler';

const configPath = path.join(__dirname, '../../utils/config/config.json'); 
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

export const command = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about the server.'),
    async execute(interaction) {
        try {
            const { guild } = interaction;
            if (!guild) return interaction.reply("This command can only be used in a server.");

            await interaction.deferReply();

            const members = await guild.members.fetch();
            const latestMember = members.sort((a, b) => b.joinedTimestamp - a.joinedTimestamp).first();

            const embed = new EmbedBuilder()
                .setColor(0x1ABC9C2) // A nice teal color
                .setTitle(`${guild.name} Server Information`)
                .setThumbnail(guild.iconURL())
                .addFields(
                    { name: 'Server Name', value: guild.name, inline: true },
                    { name: 'Total Members', value: String(guild.memberCount), inline: true },
                    { name: 'Region', value: 'USA', inline: true }, 
                    { name: 'Creation Date', value: guild.createdAt.toUTCString(), inline: true },
                    { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                    { name: 'Latest Member', value: `${latestMember.user.tag} (${latestMember.toString()})`, inline: true },
                );

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log("Entered catch block", error);
            sendErrorEmbed(interaction, error);
        }
        
    },
};
