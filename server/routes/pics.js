const express = require("express");
const router = express.Router();
const users = require("../data/users");

router.get("/generate", async (req, res) => {
    try{
        let style = req.query.style;
        let text = req.query.text;
        let validStyles = ['future-architecture-generator', 'fantasy-world-generator', 'stable-diffusion'];
        if (!validStyles.includes(style)) throw "Style not valid";
        let resp = await users.generateImage({"style": style, "text": text});
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