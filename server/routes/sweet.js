const express = require("express");
const router = express.Router();
const sweets = require("../data/sweets");
const users = require("../data/users");


//POST signup    
router.post('/signup', async (req, res) => {
    try {
        const username = users.checkUsername(req.body.username);
        const name = users.checkName(req.body.name);
        const password = users.checkPassword(req.body.password);

        const user = await users.createUser(
            name,
            username,
            password,
        );

        if (user.userInserted) {
            return res.status(200).json({ success :  'user signed up' });;
        } else {
            res.status(500).json({ error :  'Internal Server Error' });
            return;
        }
    } catch (e) {
        res.status(500).json({ error : e });
        return;
    }

});

//POST login
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let user;
    try {
        user = await users.checkUserLogin(username, password);
    } catch (e) {
        return res.status(400).json( { error : e });
    }

    try {
        if (user.authenticated) {
            req.session.user = username;
            console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} Authenticated User`);
            return res.status(200).send("logged in");
        } else {
            console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} Non-Authenticated User`);
            res.status(400).json({ error: 'username or password is not valid' });
            return;
        }
    } catch (e) {
        res.status(400).json({ error: e });
        return;
    }
});

// GET logout
router.get('/logout', async (req, res) => {
    if (await req.session.user) {
        req.session.destroy();
        res.send("Logged out")
        return;
    }
});

//GET all sweet
router.get("/", async (req, res) => {
    try{
        let page;
        if (req.query.page){
            page = req.query.page;
        } else{
            page = 1
        }
        let sweetData = await sweets.getAllSweet(page);
        res.send(sweetData);
    } catch(e) {
        return res.status(400).json({error: e});
    }
});

//GET sweet by id
router.get("/:id", async (req, res) => {
    try{
        let sweetData = await sweets.getSweetById(req.params.id);
        res.send(sweetData);
    } catch(e) {
        return res.status(400).json({error: e});
    }
});

//POST sweet
router.post("/", async (req, res) => {
    let user = req.session.user;
    if (user){
        try {
            const userInfo = await users.getUserByName(user);
            const userThatPosted = {_id : userInfo._id.toString(), username : userInfo.username};
            const sweetText = req.body.sweetText;
            const sweetMood = req.body.sweetMood;
            const addInfo = await sweets.createSweet(userThatPosted, sweetText, sweetMood);
            return res.send(addInfo);
        }
        catch (e) {
            return res.status(404).json({error: e});
        }
    } else{
        return res.json("user not logged in");
    }
});

//PATCH sweet
router.post("/:id", async (req, res) => {
    let user = req.session.user;
    if (user){
        try {
            const userInfo = await users.getUserByName(user);
            const updateInfo = await sweets.updateSweet(req.params.id, userInfo._id, req.body);
            return res.send(updateInfo);
        }
        catch (e) {
            return res.status(404).json({error: e});
        }
    } else{
        return res.json("user not logged in");
    }
});

//POST reply
router.post("/:id/replies", async (req, res) => {
    let user = req.session.user;
    if (user){
        try {
            const userInfo = await users.getUserByName(user);
            const userThatPostedReply = {_id : userInfo._id.toString(), username : userInfo.username};
            const replyInfo = await sweets.createReply(req.params.id, userThatPostedReply, req.body.reply);
            return res.send(replyInfo);
        }
        catch (e) {
            return res.status(404).json({error: e});
        }
    } else{
        return res.json("user not logged in");
    }
});

//DELETE reply
router.delete("/:sweetId/:replyId", async (req, res) => {
    let user = req.session.user;
    if (user){
        try {
            const userInfo = await users.getUserByName(user);
            const userDelete = userInfo.username;

            const deleteInfo = await sweets.deleteReply(req.params.sweetId, req.params.replyId, userDelete);
            return res.send(deleteInfo);
        }
        catch (e) {
            return res.status(404).json({error: e});
        }
    } else{
        return res.json("user not logged in");
    }
});

//POST like
router.post("/:id/likes", async (req, res) => {
    let user = req.session.user;
    if (user){
        try {
            const userInfo = await users.getUserByName(user);
            const likeInfo = await sweets.createLike(req.params.id, userInfo._id.toString());
            return res.send(likeInfo);
        }
        catch (e) {
            return res.status(404).json({error: e});
        }
    } else{
        return res.json("user not logged in");
    }
});

module.exports = router;