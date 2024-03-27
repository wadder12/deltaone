import { EmbedBuilder } from 'discord.js';
import fs from 'fs';
import crypto from 'crypto'; 

function generateErrorId() {
  return crypto.randomBytes(5).toString('hex');
}

function logError(errorId, errorDetails) {
  const filePath = 'errors/errorMessages.json'; 
  let errorLog = {};
  try {
    errorLog = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error("Failed to read the error log file, creating a new one.");
  }
  errorLog[errorId] = errorDetails;
  fs.writeFileSync(filePath, JSON.stringify(errorLog, null, 2), 'utf8');
}

async function sendErrorEmbed(interaction, error) {
  const errorId = generateErrorId();
  logError(errorId, { message: error.message, stack: error.stack });
  const userErrorMessage = `Sorry, an error occurred. Please report this ID to an admin: ${errorId}`;

  const embed = new EmbedBuilder()
    .setColor(0xFF0000) 
    .setTitle('Error')
    .setDescription(userErrorMessage);

  await interaction.reply({ embeds: [embed], ephemeral: true }).catch(console.error);
}

export { sendErrorEmbed };



/**
 * @IMPORTANT ERROR HANDLING GUIDELINES:
 * 
 * @Every command in this project is required to include error handling to ensure the bot's stability
 * and provide a consistent user experience. To achieve this, follow the pattern outlined below 
 * in every command's execution block.
 * 
 * @The use of the `sendErrorEmbed` function is mandatory in the catch block of every command. This function
 * logs the error details for administrators and sends a user-friendly error message to the user,
 * including a unique error ID for further investigation.
 * 
 * @Example :
 * 
 * try {
 *     // Command logic goes here
 * } catch (error) {
 *     console.error(error); // Logs the error for debugging.
 *     await sendErrorEmbed(interaction, error); // Notifies the user of the error and logs it.
 * }
 * 
 * @This pattern helps in identifying and debugging errors more efficiently and maintains a
 * high-quality user experience by informing users when something goes wrong.
 * 
 * @Please ensure this error handling mechanism is included in every command you develop
 * to maintain the integrity and reliability of our bot.
 */


