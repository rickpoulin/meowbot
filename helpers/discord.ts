import { Twitter } from './twitter';
import { Reddit } from './reddit';
const Discord = require('discord.js');

const discordPost = (content: Object): Promise<void> => new Promise((resolve: Function, reject: Function) => {
    const client = new Discord.Client();
    client.once('ready', () => {
        console.log('ready');
        client.channels.fetch(process.env.DISCORD_CHANNELID)
            .then(channel => channel.send(content))
            .then(message => { console.log('sent', message); client.destroy() })
            .catch(error => reject(error));
    });
    console.log('logging in');
    client.login(process.env.DISCORD_KEY);
});

export const discordPostMessage = (msg: string): Promise<void> => new Promise((resolve: Function, reject: Function) => {
    if (msg === null) {
        reject(new Error("No message to post!"));
        return;
    }
    const discordMessage: DiscordMessage = {
        'tts': false,
        'content': msg
    };

    resolve(discordPost(discordMessage));
});

export const discordPostTweet = (title: string, tweet: Twitter.Tweet): Promise<void> => new Promise((resolve: Function, reject: Function) => {
    if (tweet == null) {
        reject(new Error("No tweet to post!"));
        return;
    }
    console.log(tweet);
    

    const text = tweet.full_text.replace(/https:\/\/t.co\/\w+$/g, "");
    const discordMessage: DiscordMessage = {
        'tts': false,
        'content': `__**Meowbot's ${title} Thought of the Week**__\n\n${text}`
    };

    if (tweet.extended_entities != null && tweet.extended_entities.media != null) {
        console.log(tweet.extended_entities.media);
        discordMessage.embed = {
            color: 0x00ff99,
            image: { url: tweet.extended_entities.media[0].media_url_https }
        };
    }

    if (tweet.quoted_status != null) {
        console.log(tweet.quoted_status);
        let quotedText = tweet.quoted_status.full_text;
        if (tweet.quoted_status.entities != null && tweet.quoted_status.entities.urls != null) {
            tweet.quoted_status.entities.urls.every(item => {
                quotedText = quotedText.replace(item.url, item.expanded_url);
            });
        }
        quotedText = quotedText.replace(/https:\/\/t.co\/\w+$/g, "");

        if (discordMessage.embed == null) {
            discordMessage.embed = { color: 0x00ff99 };
        }
        discordMessage.embed.title = tweet.quoted_status.user.name + '@' + tweet.quoted_status.user.screen_name;
        discordMessage.embed.description = quotedText;
        if (tweet.quoted_status.extended_entities != null && tweet.quoted_status.extended_entities.media != null) {
            console.log(tweet.quoted_status.extended_entities.media);
            discordMessage.embed.thumbnail = { url: tweet.quoted_status.extended_entities.media[0].media_url_https };
        }
    }

    resolve(discordPost(discordMessage));
});

export const discordPostThread = (feed: string, thread: Reddit.Thread): Promise<void> => new Promise((resolve: Function, reject: Function) => {
    if (thread == null) {
        reject(new Error("No thread to post!"));
        return;
    }
    console.log(thread);

    let tdata = thread.data;
    let title = tdata.title;
    let content = tdata.selftext;
    if (!title.match(/[\.\?\!"]\s*$/)) {
        title += '.';
    }
    if (tdata.is_self && content.match(/\S/)) {
        if (!content.match(/[\.\?\!"]\s*$/)) {
            content += '.';
        }
        content = content.replace(/\\n/g, "\n");
        content = content.replace(/\n+edit\b.*$/gi, "");
        content = "\n\n" + content;
    }
    if (!tdata.is_self) {
        content += "\n\n" + tdata.url;
    }

    const discordMessage: DiscordMessage = {
        'tts': false,
        embed: {
            title: `TheDailyPurr, "${feed}" edition`,
            description: title + content,
            color: 0x0099ff
        }
    };

    resolve(discordPost(discordMessage));
});

interface DiscordMessage {
    tts: boolean;
    content?: string;
    embed?: {
        color: number;
        image?: { url: string; };
        title?: string;
        description?: string;
        thumbnail?: {
            url: string;
        }
    };
}
