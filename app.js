const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

function detectIPhoneModel(clientInfo) {
    const iPhoneModels = [
        { model: 'iPhone 15 Pro Max', width: 430, height: 932, pixelRatio: 3, dynamicIsland: true, isProMotion: true },
        { model: 'iPhone 15 Pro', width: 393, height: 852, pixelRatio: 3, dynamicIsland: true, isProMotion: true },
        { model: 'iPhone 15 Plus', width: 430, height: 932, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 15', width: 393, height: 852, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 14 Pro Max', width: 430, height: 932, pixelRatio: 3, dynamicIsland: true, isProMotion: true },
        { model: 'iPhone 14 Pro', width: 393, height: 852, pixelRatio: 3, dynamicIsland: true, isProMotion: true },
        { model: 'iPhone 14 Plus', width: 428, height: 926, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 14', width: 390, height: 844, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 13 Pro Max', width: 428, height: 926, pixelRatio: 3, dynamicIsland: false, isProMotion: true },
        { model: 'iPhone 13 Pro', width: 390, height: 844, pixelRatio: 3, dynamicIsland: false, isProMotion: true },
        { model: 'iPhone 13', width: 390, height: 844, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 13 Mini', width: 375, height: 812, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 12 Pro Max', width: 428, height: 926, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 12 Pro', width: 390, height: 844, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 12', width: 390, height: 844, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 12 Mini', width: 375, height: 812, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 11 Pro Max', width: 414, height: 896, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 11 Pro', width: 375, height: 812, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 11', width: 414, height: 896, pixelRatio: 2, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone XS Max', width: 414, height: 896, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone XS', width: 375, height: 812, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone XR', width: 414, height: 896, pixelRatio: 2, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone X', width: 375, height: 812, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 8 Plus', width: 414, height: 736, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 8', width: 375, height: 667, pixelRatio: 2, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 7 Plus', width: 414, height: 736, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 7', width: 375, height: 667, pixelRatio: 2, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 6S Plus', width: 414, height: 736, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 6S', width: 375, height: 667, pixelRatio: 2, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 6 Plus', width: 414, height: 736, pixelRatio: 3, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone 6', width: 375, height: 667, pixelRatio: 2, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone SE (2nd generation)', width: 375, height: 667, pixelRatio: 2, dynamicIsland: false, isProMotion: false },
        { model: 'iPhone SE (3rd generation)', width: 375, height: 667, pixelRatio: 2, dynamicIsland: false, isProMotion: false },
    ];

    const matchedModel = iPhoneModels.find(model => 
        model.width === clientInfo.screenWidth && 
        model.height === clientInfo.screenHeight &&
        model.pixelRatio === clientInfo.devicePixelRatio &&
        model.dynamicIsland === clientInfo.dynamicIsland &&
        model.isProMotion === clientInfo.isProMotion
    );

    if (matchedModel) {
        return `${matchedModel.model} (Dynamic Island: ${matchedModel.dynamicIsland ? 'Yes' : 'No'}, ProMotion: ${matchedModel.isProMotion ? 'Yes' : 'No'})`;
    }

    return `Unknown iPhone (Screen: ${clientInfo.screenWidth}x${clientInfo.screenHeight}, Pixel Ratio: ${clientInfo.devicePixelRatio})`;
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/detect', (req, res) => {
    const clientInfo = req.body;
    const iPhoneModel = detectIPhoneModel(clientInfo);
    res.json({ model: iPhoneModel, clientInfo: clientInfo });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
