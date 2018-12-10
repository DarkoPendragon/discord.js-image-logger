module.exports = (client, options) => {
  const Discord = require("discord.js");
  class ImageLogger {
    constructor(client, options) {
      this.imageExtensions = new Set(require('./image-extensions.json').extensions);
      this.method = (options && options.method) || "link";
      this.serverWide = (options && typeof options.serverWide !== 'undefined' ? options && options.serverWide : false);
      this.channels = (options && options.channels) || [];
      this.logChannel = (options && options.logChannel) || "image-logs";
      this.logging = (options && typeof options.logging !== 'undefined' ? options && options.logging : false);
    };

    isImage(file_path) {
      return this.imageExtensions.has(path.extname(file_path).slice(1).toLowerCase());
    };
  };
  const DIL = new ImageLogger(client, options);

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
      const links = [];
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
    };
  });
};
