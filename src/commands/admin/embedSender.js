// src/commands/admin/embedManager.js
import { SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js';
import { sendErrorEmbed } from '../../utils/events/errorHandler';

export const command = {
    data: new SlashCommandBuilder()
        .setName('embedmanager')
        .setDescription('Sends or updates an embed in a specified channel based on JSON input.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send or update the embed in')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)) 
        .addStringOption(option =>
            option.setName('json')
                .setDescription('The JSON string of the embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('messageid')
                .setDescription('The ID of the message to update (leave empty to send new)')
                .setRequired(false)),
    async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('channel', true);
            const jsonString = interaction.options.getString('json', true);
            const messageId = interaction.options.getString('messageid');

            const data = JSON.parse(jsonString);
    
            const messageContent = data.content || ''; 
            const embedsData = data.embeds || [];
            if (embedsData.length === 0) {
                throw new Error('No embeds found in the JSON. Ensure the JSON includes an "embeds" array with at least one embed object.');
            }
            const embeds = embedsData.map(embedData => new EmbedBuilder(embedData));
    
            if (messageId) {
                const message = await channel.messages.fetch(messageId);
                await message.edit({ content: messageContent, embeds });
                await interaction.reply({ content: `Embed updated successfully in ${channel.name}.`, ephemeral: true });
            } else {
                await channel.send({ content: messageContent, embeds });
                await interaction.reply({ content: `Embed sent successfully to ${channel.name}.`, ephemeral: true });
            }
        } catch (error) {
            console.error(`Error in embedManager command: ${error}`);
            sendErrorEmbed(interaction, error);
        }
    },
};


/**
 * @command     embedManager
 * @description Sends or updates an embed in a specified channel based on JSON input.
 * @author      Andrew Wade
 * @note        This code should be treated as read-only and not modified directly.
 *              Any changes or updates should be made through the proper development channels.
 */