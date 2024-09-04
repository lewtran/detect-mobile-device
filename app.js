const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors')
const uach = require('ua-client-hints-js');
const dotenv = require('dotenv');
const TelegramBot = require('node-telegram-bot-api');

require('dotenv').config();
const app = express();
app.use(cors())

const port = 3000;

const key = fs.readFileSync(path.join(__dirname, 'key.pem'));
const cert = fs.readFileSync(path.join(__dirname, 'cert.pem'));
app.use(express.json());

app.use((req, res, next) => {
    res.set({
        'Accept-CH': 'Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Model, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version',
        'Critical-CH': 'Sec-CH-UA-Model',
    });
    next();
});

const tgAPIKey = process.env.TGAPIKEY;
const bot = new TelegramBot(tgAPIKey, {polling: true}); 
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    // Send message with inline keyboard
    bot.sendMessage(chatId, 'Open the Web App:', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Open Web App',
                        web_app: { 
                            url: 'https://192.168.1.158:3000' 
                        }
                    }
                ]
            ]
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/detect', (req, res) => {
    let detectedModel = "Unknown Device";
    
    // Init Client Hint to detect Android devices
    const ch = new uach.UAClientHints();
    ch.setValuesFromHeaders(req.headers);
    const chData = ch.getValues();
    uaMobile = chData['mobile'];
    uaPlatform = chData['platform'];
    uaModel = chData['model'];
    uaPlatformVersion = chData['platformVersion'];

    // Detect iPhone and iPad models using clientInfo
    const clientInfo = req.body;
    if (clientInfo && clientInfo.platform === 'iOS') {
        detectedModel = detectAppleDevice(clientInfo);
    }

    // Detect Android Phone and Tablet models using Client Hints
    else if (uaPlatform === 'Android' && uaModel) {
        detectedModel = `Android ${uaModel}`;
    }

    res.json({
        detectedModel: detectedModel,
        platform: uaPlatform || clientInfo.platform || 'Unknown Platform',
        platformVersion: uaPlatformVersion || clientInfo.osVersion || 'Unknown Version',
        clientHints: {
            model: uaModel,
            platform: uaPlatform,
            platformVersion: uaPlatformVersion,
            mobile: uaMobile
        },
        clientInfo: clientInfo
    });
});

function detectAppleDevice(clientInfo) {
    const appleDevices = [
        // iPhone models
        { model: 'iPhone 15 Pro Max', width: 430, height: 932, pixelRatio: 3, viewportWidth: 430, viewportHeight: 932, dynamicIsland: true, isProMotion: true },
        { model: 'iPhone 15 Pro', width: 393, height: 852, pixelRatio: 3, viewportWidth: 393, viewportHeight: 852, dynamicIsland: true, isProMotion: true },
        { model: 'iPhone 15 Plus', width: 430, height: 932, pixelRatio: 3, viewportWidth: 428, viewportHeight: 926, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 15', width: 393, height: 852, pixelRatio: 3, viewportWidth: 390, viewportHeight: 844, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 14 Pro Max', width: 430, height: 932, pixelRatio: 3, viewportWidth: 430, viewportHeight: 932, dynamicIsland: true, isProMotion: true },
        { model: 'iPhone 14 Pro', width: 393, height: 852, pixelRatio: 3, viewportWidth: 393, viewportHeight: 852, dynamicIsland: true, isProMotion: true },
        { model: 'iPhone 14 Plus', width: 428, height: 926, pixelRatio: 3, viewportWidth: 428, viewportHeight: 926, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 14', width: 390, height: 844, pixelRatio: 3, viewportWidth: 390, viewportHeight: 844, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 13 Pro Max', width: 428, height: 926, pixelRatio: 3, viewportWidth: 430, viewportHeight: 932, dynamicIsland: false, isProMotion: true },
        { model: 'iPhone 13 Pro', width: 390, height: 844, pixelRatio: 3, viewportWidth: 390, viewportHeight: 844, dynamicIsland: false, isProMotion: true },
        { model: 'iPhone 13', width: 390, height: 844, pixelRatio: 3, viewportWidth: 390, viewportHeight: 844, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 13 Mini', width: 375, height: 812, pixelRatio: 3, viewportWidth: 375, viewportHeight: 812, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 12 Pro Max', width: 428, height: 926, pixelRatio: 3, viewportWidth: 430, viewportHeight: 932, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 12 Pro', width: 390, height: 844, pixelRatio: 3, viewportWidth: 390, viewportHeight: 844, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 12', width: 390, height: 844, pixelRatio: 3, viewportWidth: 390, viewportHeight: 844, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 12 Mini', width: 375, height: 812, pixelRatio: 3, viewportWidth: 375, viewportHeight: 812, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 11 Pro Max', width: 414, height: 896, pixelRatio: 3, viewportWidth: 414, viewportHeight: 896, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 11 Pro', width: 375, height: 812, pixelRatio: 3, viewportWidth: 375, viewportHeight: 812, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 11', width: 414, height: 896, pixelRatio: 2, viewportWidth: 414, viewportHeight: 896, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone XS Max', width: 414, height: 896, pixelRatio: 3, viewportWidth: 414, viewportHeight: 896, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone XS', width: 375, height: 812, pixelRatio: 3, viewportWidth: 375, viewportHeight: 812, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone XR', width: 414, height: 896, pixelRatio: 2, viewportWidth: 414, viewportHeight: 896, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone X', width: 375, height: 812, pixelRatio: 3, viewportWidth: 375, viewportHeight: 812, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 8 Plus', width: 414, height: 736, pixelRatio: 3, viewportWidth: 414, viewportHeight: 736, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 8', width: 375, height: 667, pixelRatio: 2, viewportWidth: 375, viewportHeight: 667, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 7 Plus', width: 414, height: 736, pixelRatio: 3, viewportWidth: 414, viewportHeight: 736, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 7', width: 375, height: 667, pixelRatio: 2, viewportWidth: 375, viewportHeight: 667, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 6S Plus', width: 414, height: 736, pixelRatio: 3, viewportWidth: 414, viewportHeight: 736, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 6S', width: 375, height: 667, pixelRatio: 2, viewportWidth: 375, viewportHeight: 667, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 6 Plus', width: 414, height: 736, pixelRatio: 3, viewportWidth: 414, viewportHeight: 736, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 6', width: 375, height: 667, pixelRatio: 2, viewportWidth: 375, viewportHeight: 667, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone SE (3rd generation)', width: 375, height: 667, pixelRatio: 2, viewportWidth: 375, viewportHeight: 667, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone SE (2nd generation)', width: 375, height: 667, pixelRatio: 2, viewportWidth: 375, viewportHeight: 667, dynamicIsland: false, isProMotion: false },

        // iPad models
        { model: 'iPad Pro 12.9-inch (6th generation)', width: 1024, height: 1366, pixelRatio: 2, viewportWidth: 1024, viewportHeight: 1366, dynamicIsland: false, isProMotion: true },
        { model: 'iPad Pro 11-inch (4th generation)', width: 834, height: 1194, pixelRatio: 2, viewportWidth: 834, viewportHeight: 1194, dynamicIsland: false, isProMotion: true },
        { model: 'iPad Air (5th generation)', width: 820, height: 1180, pixelRatio: 2, viewportWidth: 820, viewportHeight: 1180, dynamicIsland: false, isProMotion: true },
        { model: 'iPad mini (6th generation)', width: 744, height: 1133, pixelRatio: 2, viewportWidth: 744, viewportHeight: 1133, dynamicIsland: false, isProMotion: false },
        { model: 'iPad (10th generation)', width: 820, height: 1180, pixelRatio: 2, viewportWidth: 820, viewportHeight: 1180, dynamicIsland: false, isProMotion: false },
        { model: 'iPad Pro 12.9-inch (5th generation)', width: 1024, height: 1366, pixelRatio: 2, viewportWidth: 1024, viewportHeight: 1366, dynamicIsland: false, isProMotion: true },
        { model: 'iPad Pro 11-inch (3rd generation)', width: 834, height: 1194, pixelRatio: 2, viewportWidth: 834, viewportHeight: 1194, dynamicIsland: false, isProMotion: true },
        { model: 'iPad Air (4th generation)', width: 820, height: 1180, pixelRatio: 2, viewportWidth: 820, viewportHeight: 1180, dynamicIsland: false, isProMotion: true },
        { model: 'iPad (9th generation)', width: 810, height: 1080, pixelRatio: 2, viewportWidth: 810, viewportHeight: 1080, dynamicIsland: false, isProMotion: false },
        { model: 'iPad mini (5th generation)', width: 768, height: 1024, pixelRatio: 2, viewportWidth: 768, viewportHeight: 1024, dynamicIsland: false, isProMotion: false },
        { model: 'iPad (8th generation)', width: 810, height: 1080, pixelRatio: 2, viewportWidth: 810, viewportHeight: 1080, dynamicIsland: false, isProMotion: false },
        { model: 'iPad (7th generation)', width: 810, height: 1080, pixelRatio: 2, viewportWidth: 810, viewportHeight: 1080, dynamicIsland: false, isProMotion: false },
        { model: 'iPad Pro 12.9-inch (4th generation)', width: 1024, height: 1366, pixelRatio: 2, viewportWidth: 1024, viewportHeight: 1366, dynamicIsland: false, isProMotion: true },
        { model: 'iPad Pro 11-inch (2nd generation)', width: 834, height: 1194, pixelRatio: 2, viewportWidth: 834, viewportHeight: 1194, dynamicIsland: false, isProMotion: true },
        { model: 'iPad Air (3rd generation)', width: 820, height: 1180, pixelRatio: 2, viewportWidth: 820, viewportHeight: 1180, dynamicIsland: false, isProMotion: true },
        { model: 'iPad mini (5th generation)', width: 768, height: 1024, pixelRatio: 2, viewportWidth: 768, viewportHeight: 1024, dynamicIsland: false, isProMotion: false },
        { model: 'iPad (6th generation)', width: 810, height: 1080, pixelRatio: 2, viewportWidth: 810, viewportHeight: 1080, dynamicIsland: false, isProMotion: false },
        { model: 'iPad Pro 12.9-inch (3rd generation)', width: 1024, height: 1366, pixelRatio: 2, viewportWidth: 1024, viewportHeight: 1366, dynamicIsland: false, isProMotion: true },
        { model: 'iPad Pro 11-inch (1st generation)', width: 834, height: 1194, pixelRatio: 2, viewportWidth: 834, viewportHeight: 1194, dynamicIsland: false, isProMotion: true },
        { model: 'iPad Pro 10.5-inch', width: 834, height: 1112, pixelRatio: 2, viewportWidth: 834, viewportHeight: 1112, dynamicIsland: false, isProMotion: true },
        { model: 'iPad Pro 12.9-inch (2nd generation)', width: 1024, height: 1366, pixelRatio: 2, viewportWidth: 1024, viewportHeight: 1366, dynamicIsland: false, isProMotion: true },
        { model: 'iPad Pro 9.7-inch', width: 768, height: 1024, pixelRatio: 2, viewportWidth: 768, viewportHeight: 1024, dynamicIsland: false, isProMotion: true },
        { model: 'iPad Pro 12.9-inch (1st generation)', width: 1024, height: 1366, pixelRatio: 2, viewportWidth: 1024, viewportHeight: 1366, dynamicIsland: false, isProMotion: true },
        { model: 'iPad Air 2', width: 768, height: 1024, pixelRatio: 2, viewportWidth: 768, viewportHeight: 1024, dynamicIsland: false, isProMotion: false },
        { model: 'iPad Air', width: 768, height: 1024, pixelRatio: 2, viewportWidth: 768, viewportHeight: 1024, dynamicIsland: false, isProMotion: false },
        { model: 'iPad mini 4', width: 768, height: 1024, pixelRatio: 2, viewportWidth: 768, viewportHeight: 1024, dynamicIsland: false, isProMotion: false },
        { model: 'iPad mini 3', width: 768, height: 1024, pixelRatio: 2, viewportWidth: 768, viewportHeight: 1024, dynamicIsland: false, isProMotion: false },
        { model: 'iPad mini 2', width: 768, height: 1024, pixelRatio: 2, viewportWidth: 768, viewportHeight: 1024, dynamicIsland: false, isProMotion: false },
        { model: 'iPad (5th generation)', width: 810, height: 1080, pixelRatio: 2, viewportWidth: 810, viewportHeight: 1080, dynamicIsland: false, isProMotion: false }
    ];

    const matchedDevice = appleDevices.find(device =>
        device.width === clientInfo.screenWidth &&
        device.height === clientInfo.screenHeight &&
        device.pixelRatio === clientInfo.devicePixelRatio &&
        device.viewportWidth === clientInfo.viewportWidth &&
        device.viewportHeight === clientInfo.viewportHeight &&
        device.dynamicIsland === clientInfo.dynamicIsland &&
        device.isProMotion === clientInfo.isProMotion
    );

    return matchedDevice ? matchedDevice.model : "Unknown iOS Device";
}

https.createServer({ key: key, cert: cert }, app)
    .listen(port, () => {
        console.log(`Server running at https://localhost:${port}`);
    });
