module.exports = {
  name: "menu",
  description: "show bot menu",

  async execute(sock, msg) {

const menu = `
╭─────────────━┈⊷
│ *LUCVOICE-XMD*
╰─────────────━┈⊷
│ ᴘʀᴇғɪx: *[ . ]*
│ ᴍᴏᴅᴇ: *public*
│ ʙᴏᴛ ɴᴀᴍᴇ: *LUCVOICE-XMD*
│ ᴏᴡɴᴇʀ : *LUCVOICE*
╰─────────────━┈⊷
`

await sock.sendMessage(msg.key.remoteJid,{ text: menu })

  }
}
