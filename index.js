const {Client, GatewayIntentBits} = require("discord.js");
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log("Bot is ready!");
});

client.on("messageCreate", (message) => {
    // console.log(`Received message: ${message.content}`);
    // console.log(message.member.user);
    const attachements = message
    const isBot = message.author.bot;
    if (isBot) {
        return;
    }

    message.reply(`Hello ${message.author.username}! I am a yathish bot.`);


    // message.reply("Hello! I am a yathish bot.");
    // if (message.content === "ping") {
    //     message.reply("pong");
    // }
});

client.login(process.env.DISCORD_BOT_TOKEN);