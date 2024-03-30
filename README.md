# DeltaBot

DeltaBot is a Discord bot designed for server moderation, engagement, and information. It offers a variety of features, including:

- **Moderation**: Kick and ban users, manage embeds.
- **Server Engagement**: Ask DeltaBot questions powered by a large language model (LLM) and receive informative answers.
- **Information**: Get server information like member count, creation date, and latest member.
- **Heartbeat Monitoring**: Check the status of the bot's heartbeat to ensure it's running smoothly.

## Technologies Used

- **Discord.js**: For interacting with the Discord API.
- **Large Language Models**: Google Generative AI and potentially others (configurable) for answering questions.
- **Axios**: For making HTTP requests.
- **Bun**: Runtime environment for the bot.
- Other libraries: dotenv, fs, js-yaml, etc.

## Commands

- `/askme`: Ask DeltaBot a question and receive an answer from the LLM.
- `/pingme`: Check the bot's latency to the API and a website.
- `/serverinfo`: Get information about the server.
- `/embedmanager`: (Admin) Send or update an embed in a specified channel based on JSON input.
- `/checkme`: Check the heartbeat status of the bot.

## Configuration

1. Edit the `.env` file to set environment variables like `DISCORD_TOKEN`, `API_KEY`, and `MODEL_NAME`.
2. Modify `errors/user_info.yml` to provide context about the server and users for the LLM.
3. Update `src/utils/config/config.json` to configure the website used for ping checks.

## Running the Bot

1. Install Bun: https://bun.sh/
2. Run `bun install` to install dependencies.
3. Run `bun src/index.js` to start the bot.

## Contributing

Contributions are welcome! Please follow these guidelines:

- Use clear and concise code.
- Include error handling in all commands.
- Document your code with comments.
- Submit a pull request with your changes.

## Disclaimer

This bot is still under development and may have bugs or limitations. Please report any issues you encounter.