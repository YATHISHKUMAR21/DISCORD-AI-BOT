const {Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const {GoogleGenAi} = require("@google/genai");

require("dotenv").config();



const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const ai = new GoogleGenAi({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function generateImage(prompt) {
    try {

    //     const prompt =
    // "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";


        const response = await ai.generateContent({
             model: "gemini-3.1-flash-image-preview",
             contents : prompt
        })
    for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
     return buffer;
    }
  }
}


client.once("ready", () => {
    console.log("Bot is ready!");
});

client.on("messageCreate", async(message) => {
    // console.log(`Received message: ${message.content}`);
    // console.log(message.member.user);
    // const attachements = message
    const isBot = message.author.bot;
    if (isBot) {
        return;
    }
    const imageBuffer = await generateImage(message.content);
   if(imageBuffer) {

    const attachment = new AttachmentBuilder(imageBuffer, { name: "generated_image.png" });
    message.channel.send({ files: [attachment] });


    // message.reply(`Hello ${message.author.username}! I am a yathish bot.`);


    // message.reply("Hello! I am a yathish bot.");
    // if (message.content === "ping") {
    //     message.reply("pong");
    // }
});

client.login(process.env.DISCORD_BOT_TOKEN);