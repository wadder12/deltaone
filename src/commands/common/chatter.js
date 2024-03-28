import { SlashCommandBuilder, EmbedBuilder, DiscordAPIError } from 'discord.js';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { sendErrorEmbed } from '../../utils/events/errorHandler';
import { splitResponse, formatUserInfo, formatValue } from '../../utils/helpers/formatter';
import yaml from 'js-yaml';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_KEY;
const MODEL_NAME = process.env.MODEL_NAME;

const userInfoFile = 'errors/user_info.yml';
let userInfo;

try {
  const fileContents = fs.readFileSync(userInfoFile, 'utf8');
  userInfo = yaml.load(fileContents);
} catch (err) {
  console.error(`Error reading user information file ${userInfoFile}:`, err);
}

export const command = {
  data: new SlashCommandBuilder()
    .setName('askme')
    .setDescription('ask me questions')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('your question to delta LLM')
        .setRequired(true)),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const userInput = `${userInfo ? formatUserInfo(userInfo) : ''}${interaction.options.getString('input')}`;

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      };
      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];

      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
      });

      let result;

      try {
        result = await chat.sendMessage(userInput);
      } catch (error) {
        console.error('Error fetching from Google Generative AI API:', error);
        sendErrorEmbed(interaction, error);
      }

      const response = result.response.text();

      const chunks = splitResponse(response, 1024);

      const embeds = chunks.map((chunk, index) => {
        return new EmbedBuilder()
          .setColor(0x0099FF)
          .setTitle(`LLM (Part ${index + 1}/${chunks.length})`)
          .addFields(
            { name: 'delta bot', value: chunk, inline: false }
          );
      });

      try {
        await interaction.editReply({ embeds });
      } catch (error) {
        if (error instanceof DiscordAPIError && error.code === 'InteractionAlreadyReplied') {
          console.error('The interaction has already been replied to or deferred.');
        } else {
          console.error('Error sending reply:', error);
          sendErrorEmbed(interaction, error);
        }
      }
    } catch (error) {
    console.error(error); 
      sendErrorEmbed(interaction, error);
    }
  },
};

/**
 * @author     Andrew Wade
 * @command    askme
 * 
 * @description ask questions based off the user yml file 
 * 
 * @important  the logic code needs to be between 95-110 lines (learn to import)
 */