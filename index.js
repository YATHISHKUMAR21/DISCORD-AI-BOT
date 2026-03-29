const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const { GoogleGenAi } = require("@google/genai");
require("dotenv").config();

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
    console.error(
        "Missing DISCORD_BOT_TOKEN in environment. Add it to a .env file or your environment variables."
    );
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const ai = new GoogleGenAi({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function generateImage(prompt) {
    try {
        if (!prompt) return null;
        const response = await ai.generateContent({
            model: "gemini-3.1-flash-image-preview",
            contents: prompt,
        });
        const parts = response?.candidates?.[0]?.content?.parts;
        if (!parts) return null;
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                const imageData = part.inlineData.data;
                return Buffer.from(imageData, "base64");
            } else if (part.text) {
                console.log(part.text);
            }
        }
        return null;
    } catch (err) {
        console.error("generateImage error:", err);
        return null;
    }
}

client.once("ready", () => {
    console.log(`Bot is ready: ${client.user?.tag ?? "<unknown>"}`);
});

client.on("messageCreate", async (message) => {
    try {
        if (message.author?.bot) return;
        const imageBuffer = await generateImage(message.content);
        if (imageBuffer) {
            const attachment = new AttachmentBuilder(imageBuffer, {
                name: "generated_image.png",
            });
            await message.channel.send({ files: [attachment] });
        }
    } catch (err) {
        console.error("messageCreate handler error:", err);
    }
});

client.on("error", (e) => console.error("Discord client error:", e));
client.on("warn", (w) => console.warn("Discord client warning:", w));
process.on("unhandledRejection", (r) => console.error("Unhandled Rejection:", r));

client.login(token).catch((err) => {
    console.error("Login failed:", err);
    process.exit(1);
});