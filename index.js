import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from "dotenv";
import { ogg } from "./src/ogg.js";
import { botai } from "./src/openai.js";
import fetch from "node-fetch";

dotenv.config();

const bot = new Telegraf(`${process.env.TELEGRAM_API_KEY}`);
bot.use(session());

const LIMITED_USERS = process?.env?.TELEGRAM_USERS
  ? process.env.TELEGRAM_USERS.trim().split(",")
  : [];

const INITIAL_SESSION = {
  messages: [],
};

bot.launch();

bot.command("start", async (ctx) => {
  ctx.session === INITIAL_SESSION;
  await ctx.reply("Ask your question via text or voice message");
});

bot.on(message("text"), async (ctx) => {
  const { text } = ctx.message;
  const { from } = ctx.message;

  // Limit to specific users
  if (
    LIMITED_USERS.length > 0 &&
    LIMITED_USERS.includes(String(from.id)) === false
  ) {
    await ctx.reply("You are not allowed to use this bot");
    return;
  }

  // Initialize session
  ctx.session ??= INITIAL_SESSION;

  if (text.match("/image")) {
    try {
      await ctx.sendChatAction("upload_photo");
      const image = await botai.imageGeneration(text, String(ctx.from.id));
      await ctx.replyWithPhoto(image.path);
    } catch (e) {
      console.log("Error while image generating", e.message);
    }
  } else {
    try {
      await ctx.sendChatAction("typing");
      ctx.session.messages.push({
        role: botai.roles.USER,
        content: String(text),
      });

      const response = await botai.chat(ctx.session.messages);
      const assistantMessageText = response.content;

      ctx.session.messages.push({
        role: botai.roles.ASSISTANT,
        content: assistantMessageText,
      });

      await ctx.reply(response.content);
    } catch (e) {
      console.log("Error while text message", e.message);
    }
  }
});

bot.on(message("voice"), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;
  const { voice } = ctx.message;
  await ctx.sendChatAction("record_voice");
  try {
    // Telegram audio file link
    const voiceLink = await ctx.telegram.getFileLink(voice.file_id);
    // Create local ogg file
    const oggPath = await ogg.create(
      voiceLink.href,
      String(ctx.message.from.id)
    );
    // Convert ogg to mp3
    const mp3Path = await ogg.toMp3(oggPath, ctx.message.from.id);
    // Transcription via openAI
    const userMessageText = await botai.transcription(mp3Path);
    
    ctx.session.messages.push({
      role: botai.roles.USER,
      content: String(userMessageText),
    });

    const response = await botai.chat(ctx.session.messages);
    const assistantMessageText = response.content;

    ctx.session.messages.push({
      role: botai.roles.ASSISTANT,
      content: String(assistantMessageText),
    });

    await ctx.sendChatAction("record_voice");
    // if you have installed docker, you can use this code for voice message
    // it doesn't support persian language
    const voiceAPI = process.env.VOICE_API || "http://audio-server:5002";
    const voiceResponse = await fetch(
      `${voiceAPI}/api/tts?text=${assistantMessageText}&speaker_id=p225&style_wav=&language_id=` // you can change speaker_id to change voice
    );
    const voiceResponseJson = await voiceResponse.arrayBuffer();
    await ctx.sendChatAction("record_voice");
    const voiceResponseBuffer = Buffer.from(voiceResponseJson);
    await ctx.replyWithVoice({ source: Buffer.from(voiceResponseBuffer) });
  } catch (e) {
    console.log("Error while voice message", e.message);
  }
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
