const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcryptjs = require('bcryptjs');
const ObjectId = require('mongodb').ObjectId;
const deepai = require('deepai'); 

//Redis Queue
const Queue = require('bull');
const ordersQueue = new Queue("orders", {
    redis: process.env.REDIS_URL
});
ordersQueue.process(async function (job) {
    const data = job.data;
    try{
        deepai.setApiKey('085f3f96-c9d3-4878-adcb-ca8a8bf279a2');
        let resp = await deepai.callStandardApi(data.style, {
                text: data.text,
        });
        //console.log(resp)
        return resp;
    } catch(e){
        throw e;
    }
  });

function checkUsername(username) {
    if (typeof username !== 'string') throw 'username must be string';
    username = username.trim();
    if (username.length == 0) throw 'username is not a valid string';
    return username
}

function checkPassword(password) {
    if (typeof password !== 'string') throw 'password must be string';
    password = password.trim();
    if (password.length == 0) throw 'password is not a valid string';
    return password;
}

function checkEmail(email) {
    if (typeof email !== 'string') throw 'email must be string';
    email = email.trim();
    if (email.length == 0) throw 'email is not a valid string';
    return email;
}

const exportedMethods = {
    async createUser(
        username,
        email,
        password
    ) {
        try{
            if (!username) throw 'username must be provided';
            if (!email) throw 'email must be provided';
            if (!password) throw 'password must be provided';
    
            const saltRounds = 6;
            email = checkName(email);
            username = checkUsername(username);
            password = checkPassword(password);
            email = checkEmail(email);

            password = await bcryptjs.hash(password, saltRounds);
            let newUser = {
                email: email,
                username: username,
                password: password,
                images:[]
            };
            const usersCollection = await users();
            const newInsertInformation = await usersCollection.insertOne(newUser);
            if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
            return { userInserted: true };
        } catch (e){
            throw e
        }
    },

    async getUserByName(username) {
        try{
            const usersCollection = await users();
            const username_lower = username.toLowerCase();
            const userInfo = await usersCollection.findOne({ username: username_lower });
            if (!userInfo) throw "user not found";
            return userInfo;
        } catch (e){
            throw e
        }
    },

    async getUserById(userId) {
        try {
            const usersCollection = await users();
            if (!ObjectId.isValid(userId)) throw 'id is not a valid ObjectId';
            const userInfo = await usersCollection.findOne({ _id: ObjectId(userId) });
            if (!userInfo) throw "user not found";
            return userInfo;
        } catch (e){
            throw e
        }
    },

    async checkUserLogin(username, password) {
        try {
            if (!username) throw 'username must be provided';
            if (!password) throw 'password must be provided';
            const userInfo = await this.getUserByName(username);
            if (!userInfo) throw 'user not found';
            const pass = await bcryptjs.compare(password, userInfo.password);
            if (!pass) throw 'password is invalid';
            return { authenticated: true };
        } catch (e){
            throw e
        }
    },

    async getAllImages(...args) {
        try{
            if (args.length != 0) throw('No argument is allowed')

            const usersCollection = await users();
            const userList = await usersCollection.find({}).toArray();
            if (!userList) throw 'Could not get all users';
            let allImages = [];
            userList.forEach(element => {
                allImages.push(element.images);
            });
            return allImages;
        } catch(e){

        }
    }, 

    async generateImage(job) {
        try{
            const newJob = await ordersQueue.add(job);
            const result = await newJob.finished();
            return result
        } catch(e){
            throw e;
        }
    },

    async addImage(userId, imageUrl, style, text) {
        try {
            if (!userId) throw 'userId must be provided';
            //////add throws
            const usersCollection = await users();
            if (!ObjectId.isValid(userId)) throw 'id is not a valid ObjectId';
            let userInfo = await usersCollection.findOne({ _id: ObjectId(userId) });
            if (!userInfo) throw "user not found";

            let newImage = {
                _id: ObjectId(),
                url: imageUrl,
                style: style,
                text: text,
                likes: 0
            };

            userInfo.images.push(newImage);
            sweetInfo.replies.push(replyAddInfo);

            let updateInfo = {
                images: userInfo.images
            }
            await usersCollection.updateOne({ _id: ObjectId(userId) }, { $set: updateInfo });
            return { imageCreated: true };
        } catch(e){
            throw e
        }
    },

};

module.exports = exportedMethods;
