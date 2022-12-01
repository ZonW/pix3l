const express = require("express");
const router = express.Router();
const deepai = require('deepai'); 
const users = require("../data/users");

router.get("/generate", async (req, res) => {
    try{
        let style = req.query.style;
        let text = req.query.text;
        let validStyles = ['future-architecture-generator', 'fantasy-world-generator', 'stable-diffusion'];
        if (!validStyles.includes(text)) throw "Style not valid";
        deepai.setApiKey('085f3f96-c9d3-4878-adcb-ca8a8bf279a2');
        var resp = await deepai.callStandardApi(style, {
                text: text,
        });
        res.send(resp);
    } catch(e) {
        return res.status(400).json({error: e});
    }
});

router.get("/gallery", async (req, res) => {
    try{
       let allImages = await users.getAllImages();
        res.send(allImages);
    } catch(e) {
        return res.status(400).json({error: e});
    }
});


module.exports = router;