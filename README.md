<div align="center">
  <p>
    <a href="https://nodei.co/npm/discord.js-image-logger
/"><img src="https://nodei.co/npm/discord.js-image-logger.png?downloads=true&stars=true" alt="NPM info" /></a>
  </p>
</div>  

# Discord.js Image Logger
A simple addon for Discord.js bots to log images sent in a specified channel, channels or the entire server. It can log either with RichEmbeds or with the link to the file.

# Installation
`npm i --save discord.js-image-logger`
That's it!

# DIL Options
A full list of options and their defaults you can pass in `new <DIL>(<Client>, { options });`.  

| Option | Type | Description | Default |  
| --- | --- | --- | --- |
| method | String | The default logging of image attachments. | "link" |
| channels | Object/Array | A list of channel names or ID's to log images from, if not server wide. | [ ] |
| serverWide | Boolean | Enable/disable server wide attachment logging, rather than channel specific. | false |
| logChannel | String | A name or ID of a channel to log images by default. | "image-logs" |
| logging | Boolean | Enables some extra, none needed logging. | false |

# Usage
This will be an extremely basic example of how to setup the module.
```js
// First we require the Discord.js library.
const Discord = require("discord.js");

// Now we require the module.
const DIL = require("discord.js-image-logger");

// Start a new Discord Client.
const client = new Discord.Client();
// Start the module with some custom options.
DIL(client, {
  method: "embed", // can be "embed" "link" or "image"
  logChannel: "images",
  channels: ["some-channel","453502285318848512","another-channel"]
})

// Login the Client
client.login("discord app token");
```

# Problems?
Feel free to join the Discord server with [discord.gg/FKYrX4X](https://discord.gg/FKYrX4X) or open an issue on the repo.
