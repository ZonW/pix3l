const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
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
    async createUser(firebaseId) {
        try{
            if (!firebaseId) throw 'Id must be provided';

            let newUser = {
                firebaseId: firebaseId,
                images:[]
            };
            const usersCollection = await users();
            const userInfo = await usersCollection.findOne({ firebaseId: firebaseId });
            if (userInfo){
                return { userInserted: 'exist' };
            }
            const newInsertInformation = await usersCollection.insertOne(newUser);
            if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
            return { userInserted: true };
        } catch (e){
            throw e
        }
    },

    async getUserById(firebaseId) {
        try{
            const usersCollection = await users();
            if (!firebaseId) throw 'Id must be provided';
            const userInfo = await usersCollection.findOne({ firebaseId: firebaseId });
            if (!userInfo) throw "user not found";
            return userInfo;
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
                element.images.forEach(image =>{
                    allImages.push(image)
                })
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

    async addImage(firebaseId, imageId, style, text) {
        try {
            if (!firebaseId) throw 'Id must be provided';
            if (!imageId) throw 'imageId must be provided';
            if (!style) throw 'style must be provided';
            if (!text) throw 'text must be provided';
    
            const usersCollection = await users();
            const userInfo = await usersCollection.findOne({ firebaseId: firebaseId });
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

            let updateInfo = {
                images: userInfo.images
            }
            await usersCollection.updateOne({ firebaseId: firebaseId }, { $set: updateInfo });
          
            return { 'imageAdded': imageId };
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
