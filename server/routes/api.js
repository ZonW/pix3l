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

router.get("/userImage/:id", async (req, res) => {
    try{
        let resp = {
            firebaseId: 'XXYYUUOO',
            images:[
                {id: "4a314884-2a7d-4ac3-9f23-b4d6eac1f333",
                url: "/image/temp/4a314884-2a7d-4ac3-9f23-b4d6eac1f333.jpg",
                style: "random stuff",
                text: "random text",
                likes: 0},
                
                {id: "1302991d-ac00-4cf6-b226-e1d99baa6ce5",
                url: "/image/temp/1302991d-ac00-4cf6-b226-e1d99baa6ce5.jpg",
                style: "random stuff",
                text: "random text",
                likes: 0},
            ]
        }
        res.send(resp);
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

router.get("/deleteImage/:imageId", async (req, res) => {
    try{
        const response = await users.deleteImage(req.params.imageId);
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