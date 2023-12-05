## TELEGRAM CHATGPT BOT

This is a lightweight ChatGPT Telegram bot, enabling interaction with a large language model developed by OpenAI.

Telegram provides a secure platform for using ChatGPT due to its high-security standards. By running this code, you can harness the power of chatting, generating images, and engaging in voice conversations with ChatGPT.

# Features

- **OpenAI v4 nodejs lib support.**
- **2 way Voice messages support!**
- **AI-powered image generation**
- **Restriction to specific users**
- **Simply Run Docker compose up -d**

<p align="center">
    <img src="./demo.gif" width="300"/>
</p>

### How to install ?

- In order to use it, you must first acquire an API key from the OpenAI website. [OpenAI API](https://openai.com/)
- Second acquire telegram token from the BOTFATHER. [Telegram token](https://telegram.me/BotFather)
- Clone this repository.
- Navigate to the "telegram-chatgpt-bot" directory.
- Put your API keys and other information in the ".env.local" file.
- Rename ".env.local" to ".env" by running `mv .env.local .env`.
- Ensure you have Docker and Docker Compose installed. If not, you can install them using the following links:
  - [Install Docker](https://docs.docker.com/get-docker/)
  - [Install Docker Compose](https://docs.docker.com/compose/install/)
- If you have Docker installed, simply run `docker compose up -d`.

## ENV

```sh
OPENAI_API_KEY="your OpenAI API key"
OPENAI_ORGANIZATION="your OpenAI organization ID"
OPENAI_MODEL="your OpenAI model name, e.g., gpt-4"
TELEGRAM_USERS="your Telegram user IDs, comma-separated, e.g., 123456,1234567"
TELEGRAM_API_KEY="your Telegram API key"
VOICE_API="http://audio-server:5002"
```
