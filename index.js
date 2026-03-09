require('dotenv').config();
const fs = require('fs');
const { default: makeWASocket, useSingleFileAuthState, fetchLatestBaileysVersion } = require('@adiwajshing/baileys');

// Ensure session folder exists
const sessionFolder = './session';
if (!fs.existsSync(sessionFolder)) fs.mkdirSync(sessionFolder, { recursive: true });

// Single file session
const sessionFile = './session/session.json';
let { state, saveState } = useSingleFileAuthState(sessionFile);

// Optional: Use SESSION_ID from environment for Heroku or ephemeral storage
if (process.env.SESSION_ID) {
    try {
        const sessionData = JSON.parse(Buffer.from(process.env.SESSION_ID, 'base64').toString('utf-8'));
        fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2));
        console.log('SESSION_ID loaded from environment variable.');
        ({ state, saveState } = useSingleFileAuthState(sessionFile));
    } catch (err) {
        console.error('Failed to parse SESSION_ID env variable:', err);
    }
}

async function startBot() {
    const { version } = await fetchLatestBaileysVersion();

    const client = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true // QR code appears first run only
    });

    // Auto save session
    client.ev.on('creds.update', saveState);

    // Basic message listener
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

    console.log(`${process.env.BOT_NAME || 'Bot'} started! Scan QR code if first run.`);
}

// Start the bot
startBot();
