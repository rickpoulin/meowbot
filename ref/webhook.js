const authToken = 'NTcwNzQ5NjE2MDkwNTEzNDA5.XMD1aw.FaM18sknvVyhHx7FDzCDV3OjQ3c';
const Discord = require('discord.js');
const client = new Discord.Client();
client.once('ready', () => {
        console.info('Ready!');
});
client.on('message', message => {
        try {
                //console.debug(message);
                if (message.author.id === client.user.id || message.content == null) {
                        return;
                }
                if (message.channel.name == "wip-images") {
                        return;
                }
                if (message.channel.name != "hairballs") {
                        //return;
                }
                //console.debug("Saw message with content\n\t" + message.content);
                var match = message.content.match(/\b(https?:\/\/\S+\.(gif|png|jpg)\S*)/);
                if (match == null) {
                        match = message.content.match(/\bhttps?:\/\//);
                        if (match != null) {
                                setTimeout(function() { checkEmbeds(message) }, 500);
                        }
                        return;
                }
                boopMsg(message, match[1]);
        } catch(e) {
                console.error("Failed to do something on " + message.content);
                console.error(e);
        }
});

client.login(authToken);

function checkEmbeds(message) {
        try {
                if (message.embeds.length == 0) {
                        return;
                }
                console.info("Found delayed embed in " + message.content);
                boopMsg(message, message.embeds[0].thumbnail.url);
        } catch(e) {
                console.error("Failed to find embed on " + message.content);
                console.error(message.embeds[0]);
                console.error(e);
        }
}

function boopMsg(message, imgUrl) {
        console.info("Booping on image detection in " + message.content);
        message.channel.send(".").then(function(botMessage) {
                setTimeout(function() { switchMsg(message, botMessage, imgUrl) }, 15000);
        });
}

function switchMsg(userMsg, botMsg, imageUrl) {
        try {
                //console.debug(userMsg);
                var bestUrl = userMsg.embeds.length > 0 ? userMsg.embeds[0].thumbnail.url : null;
                if (bestUrl == null) {
                        bestUrl = imageUrl;
                }
                botMsg.edit({
                        content : null,
                        embed   : {
                                author  : {
                                        name    : userMsg.author.username,
                                        icon_url: "https://cdn.discordapp.com/avatars/" + userMsg.author.id + "/" + userMsg.author.avatar + ".png"
                                },
                                description: userMsg.content,
                                thumbnail: { url: bestUrl }
                        }
                });
                userMsg.delete();
        } catch(e) {
                console.error("Failed to do something on " + message.content);
                console.error(e);
        }
}
