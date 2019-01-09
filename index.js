const Discord = require("discord.js");
const path = require("path");
module.exports = (client, options) => {
  const DIL = {
    imageExtensions: new Set(require('./image-extensions.json').extensions),
    method: (options && options.method) || "link",
    serverWide: (options && typeof options.serverWide !== 'undefined' ? options && options.serverWide : false),
    channels: (options && options.channels) || [],
    logChannel: (options && options.logChannel) || "image-logs",
    logging: (options && typeof options.logging !== 'undefined' ? options && options.logging : false)
  };
  DIL.isImage = (file_path) => {
    return DIL.imageExtensions.has(path.extname(file_path).slice(1).toLowerCase());
  };

  client.on("ready", () => {
    console.log(`-----------------------------\nDiscord Image Logger Online\n-----------------------------`);
  });

  client.on("message", (msg) => {
    if (msg.author.bot || !msg.guild || !msg.attachments) return;
    var a = msg.attachments;
    var attachments = [];
    a.forEach(e => {
      if (DIL.isImage(e.filename)) attachments.push(e);
    });
    if (attachments.length <= 0) return;

    if (!DIL.channels.includes(msg.channel.id) && !DIL.channels.includes(msg.channel.name) && !DIL.serverWide) return;

    const logchan = msg.guild.channels.has(DIL.logChannel) ? msg.guild.channels.get(DIL.logChannel) : msg.guild.channels.find(c => c.name.toLowerCase() == DIL.logChannel.toLowerCase());
    if (!logchan) {
      if (DIL.logging) console.log(`[IMG_LOGGER] Couldn't find a logging channel for ${msg.guild.name} (${msg.guild.id})`);
      return;
    };

    if (DIL.method === "link") {
      var links = [];
      let index = 0;
      attachments.forEach(e => {
        index++;
        links.push(`**${index})** \`${e.url}\``);
      });
      logchan.send(`__New Image(s) Uploaded In #${msg.channel.name}__\nUser: ${msg.author}\n${links.join("\n")}`).catch(console.log);
    } else if (DIL.method === "embed") {
      const embed = new Discord.RichEmbed();
      embed.setAuthor(msg.author.username, msg.author.displayAvatarURL);
      if (attachments.length == 1) embed.setFooter(`New Upload: #${msg.channel.name}`);
      if (attachments.length > 1) embed.setFooter(`New Uploads: #${msg.channel.name}`);
      embed.setImage(attachments[0].url);
      attachments.forEach(at => {
        embed.addField(at.filename, at.url);
      });
      embed.setColor("DARK_PURPLE");
      logchan.send({
        embed
      }).catch(console.log);
    } else if (DIL.method == "image") {
      var links = []
      let index = 0;
      attachments.forEach(e => {
        links.push(`e.url`);
      });
      try {
        logChannel.send(`${attachments.length} Image(s) Send In #${message.channel.id} by <@${message.author.id}>`,{files: links})
      } catch (e) {
        try {
          logChannel.send(`\`Failed Upload Attempt - File Size Too Big?\`\n${attachments.size} Image(s) Send In #${message.channel.id} by <@${message.author.id}>\n\`\`\`\n${links}\n\`\`\``)
        } catch (e) {
          console.error(e);
        };
      };
    };
  });
};
