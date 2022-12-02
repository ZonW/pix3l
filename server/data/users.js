const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcryptjs = require('bcryptjs');
const ObjectId = require('mongodb').ObjectId;
const deepai = require('deepai'); 
const { v4: uuid } = require('uuid');
const sharp = require('sharp');
const axios = require("axios");
const fs = require('fs')

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

async function cropImage(url, left, top) {
    let id = uuid();
    const image = (await axios({ url: url, responseType: "arraybuffer" })).data;
    sharp(image)
        .extract({ left: left, top: top, width: 512, height: 512 })
        .toFile('./public/image/temp/'+ id + '.jpg', function(err) {
            if(err){
                throw err;
            }
        });
      return {'id': id, 'url':'localhost:3000/image/temp/' + id + '.jpg'};
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
            out = []
            const newJob = await ordersQueue.add(job);
            const result = await newJob.finished();
            if (result.id && result.output_url){
                const nw = await cropImage(result.output_url, 0, 0);
                const ne = await cropImage(result.output_url, 0, 512);
                const se = await cropImage(result.output_url, 512, 0);
                const sw = await cropImage(result.output_url, 512, 512);
                out.push(nw);
                out.push(ne);
                out.push(se);
                out.push(sw);
            }
            return out;
        } catch(e){
            throw e;
        }
    },

    async addImage(userId, imageId, style, text) {
        try {
            if (!userId) throw 'userId must be provided';
            if (!imageId) throw 'imageId must be provided';
            if (!style) throw 'style must be provided';
            if (!text) throw 'text must be provided';
    
            const usersCollection = await users();
            if (!ObjectId.isValid(userId)) throw 'id is not a valid ObjectId';
            let userInfo = await usersCollection.findOne({ _id: ObjectId(userId) });
            if (!userInfo) throw "user not found";

            fs.rename('./public/image/temp/' + imageId + '.jpg','./public/image/perm/' + imageId + '.jpg', function (err) {
                if (err) throw err
            });
            let newUrl = 'localhost:3000/image/perm/' + imageId + '.jpg';
            let newImage = {
                id: imageId,
                url: newUrl,
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
          
            return { imageCreated: imageId };
        } catch(e){
            throw e
        }
    },

    async deleteImage(imageId) {
        try{
            let url = './public/image/temp/' + imageId + '.jpg';
            let flag = false
            fs.unlink(url, function(err) {
                if (err) console.log(err);
                else{
                    flag = true;
                    //////sth wrong with callback but functional
                }
            });
            if (flag){
                return {'deleted' : imageId}
            } else{
                return {'error': 'Does not exist'}
            }
        } catch(e){
            throw e;
        }
    },

};

module.exports = exportedMethods;
