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

router.post("/addImage", async (req, res) => {
    try{
       const response = await users.addImage(req.body.userId, req.body.imageId, req.body.style, req.body.text);
        res.send(response);
    } catch(e) {
        return res.status(400).json({error: e});
    }
});

router.get("/deleteCache", async (req, res) => {
    try{
        const response = await users.deleteImage();
        res.send(response);
    } catch(e) {
        return res.status(400).json({error: e});
    }
});

router.get("/getUser/:firebaseId", async (req, res) => {
    try{
        const response = await users.getUserById(req.params.firebaseId);
        res.send(response);
    } catch(e) {
        return res.status(400).json({error: e});
    }
});

router.post("/newUser/:firebaseId", async (req, res) => {
    try{
        const response = await users.createUser(req.params.firebaseId);
        res.send(response);
    } catch(e) {
        return res.status(400).json({error: e});
    }
});


module.exports = router;