import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import { sendErrorEmbed } from '../../utils/events/errorHandler'; 

const axiosInstance = axios.create({ // have to do this since bun doesnt support zlib 
  decompress: false,
});

export const command = {
  data: new SlashCommandBuilder()
    .setName('checkme')
    .setDescription('checks my heartbeat status'),
  async execute(interaction) {
    const teamToken = process.env.TEAM_TOKEN;
    const heartbeatId = process.env.HEARTBEAT_ID;

    if (!teamToken || !heartbeatId) {
      await interaction.reply({
        content: "Error: Required environment variables `TEAM_TOKEN` or `HEARTBEAT_ID` are not set.",
        ephemeral: true
      });
      return;
    }

    const url = `https://uptime.betterstack.com/api/v2/heartbeats/${heartbeatId}`;
    const headers = { Authorization: `Bearer ${teamToken}` };

    try {
      const response = await axiosInstance.get(url, { headers });

      if (response.status === 200) {
        const heartbeat = response.data.data?.attributes || response.data;

        if (heartbeat) {
            const isUp = heartbeat.status === "up";
            const color = isUp ? '#00FF00' : '#FF0000'; 
          
            const statusText = heartbeat.status ? heartbeat.status.toUpperCase() : 'N/A';
            const name = heartbeat.name || 'N/A';
          
            const embed = new EmbedBuilder()
              .setColor(color)
              .setTitle(`🫀 Heartbeat Status: ${name}`)
              .setDescription(`Status: **${statusText}**`)
              .addFields(
                { name: "Email Notifications", value: heartbeat.email ? "✅ Enabled" : "❌ Disabled", inline: true },
                { name: "Paused", value: heartbeat.paused ? "✅ Yes" : "❌ No", inline: true },
                { name: "Current Status", value: `${isUp ? "✅" : "❌"} ${statusText}`, inline: false }
              )
              .setFooter({ text: `Heartbeat ID: ${heartbeatId}` })
              .setTimestamp(new Date());
          
            await interaction.reply({ embeds: [embed] });
        }
        }
    } catch (error) {
      console.error(error);
      sendErrorEmbed(interaction, error); 
    }
  },
};