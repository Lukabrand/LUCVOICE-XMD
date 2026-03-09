require('dotenv').config();
const fs = require('fs');
const { default: makeWASocket, useSingleFileAuthState, fetchLatestBaileysVersion } = require('@adiwajshing/baileys');

// Ensure session folder exists
const sessionFolder = './session';
if (!fs.existsSync(sessionFolder)) fs.mkdirSync(sessionFolder, { recursive: true });

// Single file session
const sessionFile = './session/session.json';
const { state, saveState } = useSingleFileAuthState(sessionFile);

async function startBot() {
    // Fetch latest WhatsApp Web version
    const { version } = await fetchLatestBaileysVersion();

    // Create WhatsApp client
    const client = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true // QR code appears on first run
    });

    // Automatically save session after pairing
    client.ev.on('creds.update', saveState);

    // Simple listener: log incoming messages
    client.ev.on('messages.upsert', (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;

        const from = msg.key.remoteJid;
        const text = msg.message.conversation || '';

        console.log(`New message from ${from}: ${text}`);

        // Example commands
        if (text.startsWith('.ping')) {
            client.sendMessage(from, { text: 'Pong! Bot is active.' });
        }

        if (text.startsWith('.menu')) {
            const menu = `
*${process.env.BOT_NAME || 'Bot'} Menu*
1. .ping - Test the bot
2. .menu - Show this menu
`;
            client.sendMessage(from, { text: menu });
        }
    });

    console.log(`${process.env.BOT_NAME || 'Bot'} started! Scan QR code if this is the first run.`);
}

// Start the bot
startBot();
