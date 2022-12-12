const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { v4: uuid } = require('uuid');
const sharp = require('sharp');
const axios = require("axios");
const FormData = require('form-data');
const Queue = require('bull');
const redisUrlParse = require('redis-url-parse');
const redis = require("redis");
const AWS = require("aws-sdk")

//AWS S3 config
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

s3.listBuckets(function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.Buckets);
    }
});


//Redis Queue
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const redisUrlParsed = redisUrlParse(REDIS_URL);
const { host, port, password } = redisUrlParsed;
const bullOptions = REDIS_URL.includes('rediss://')
  ? {
      redis: {
        port: Number(port),
        host,
        password,
        tls: {
          rejectUnauthorized: false,
        },
      },
    }
  : REDIS_URL;
const ordersQueue = new Queue("orders", bullOptions);

ordersQueue.process(async function (job) {
    const data = job.data;
    try{
        console.log('Generating...')
        console.time('deepai api call');
        const formData = new FormData();
        formData.append("text", data.text);
        // deepai api call 
        let res = await axios({
            method: 'post',
            url: 'https://api.deepai.org/api/' + data.style,
            data: formData,
            headers: {
            "api-key": process.env.DEEPAI_API_KEY,
            }}
            )
            .then(function (response) {
                console.timeEnd('deepai api call');
                return response.data
            })
            .catch(function (response) {
                return response;
            });
        return res
    } catch(e){
        throw e;
    }
});

async function cropImage(url, left, top) {
    try{
    let id = uuid();
    const image = (await axios({ url: url, responseType: "arraybuffer" })).data;
    let croppedImage = await sharp(image)
        .extract({ left: left, top: top, width: 512, height: 512 })
        .toBuffer()
        .then(data => { 
            return data
         })
        .catch(err => {
            return {"error" : err} 
        });
    //upload to s3 bucket
    const uploadUrl = await s3.upload({
        Bucket: 'pix3lserver',
        Key: 's3://pix3lserver/public/image/temp/' + id + '.jpg',
        Body: croppedImage
    }).promise()
        
    return {'id': id, 'url': uploadUrl.Location};
    } catch(e){
        console.log(e)
    }
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

    async generateImageWOQ(data) {
        try{
            console.time('deepai api call');
            const formData = new FormData();
            formData.append("text", data.text);
            let res = await axios({
                method: 'post',
                url: 'https://api.deepai.org/api/' + data.style,
                data: formData,
                headers: {
                "api-key": process.env.DEEPAI_API_KEY,
                }}
                )
                .then(async function (response) {
                    console.timeEnd('deepai api call');
                    let out = [];
                    console.time('crop')
                    const nw = await cropImage(response.data.output_url, 0, 0);
                    const ne = await cropImage(response.data.output_url, 0, 512);
                    const se = await cropImage(response.data.output_url, 512, 0);
                    const sw = await cropImage(response.data.output_url, 512, 512);
                    console.timeEnd('crop')
                    out.push(nw);
                    out.push(ne);
                    out.push(se);
                    out.push(sw);
                    return out;
                })
                .catch(function (response) {
                    return response;
                });
            return res
            
        } catch(e){
            throw e;
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
            const newJob = await ordersQueue.add(job);
            const result = await newJob.finished();
            let out = []
            if (result.id && result.output_url){
                const nw = await cropImage(result.output_url, 0, 0);
                const ne = await cropImage(result.output_url, 0, 512);
                const se = await cropImage(result.output_url, 512, 0);
                const sw = await cropImage(result.output_url, 512, 512);
                out.push(nw);
                out.push(ne);
                out.push(se);
                out.push(sw);
            } else {
                return {"error": 'Time out'}
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
    
            let newImage = {
                id: imageId,
                url: 'https://pix3lserver.s3.amazonaws.com/s3%3A//pix3lserver/public/image/temp/' + imageId + '.jpg',
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

    async deleteImage(imageId){
        try{
            const res = await s3.deleteObject({
                Bucket: 'pix3lserver', 
                Key: 's3://pix3lserver/public/image/temp/' + imageId + '.jpg'
              })
            .promise()
            .then(() => {
                return {'deleted':imageId}
                }
            )
            .catch((e) => console.log(e))
            return res
        } catch(e){
            console.log(e)
            throw e;
        }
    },
};

module.exports = exportedMethods;
