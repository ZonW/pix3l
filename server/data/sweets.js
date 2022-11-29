const mongoCollections = require('../config/mongoCollections');
const sweets = mongoCollections.sweets;
const usersData = require('./users');
const bcryptjs = require('bcryptjs');
const ObjectId = require('mongodb').ObjectId;

const exportedMethods = {
  /* GET /sweets */
  async getSweetById(sweetId){
    try{
      const sweetsCollection = await sweets();
      if (!ObjectId.isValid(sweetId)) throw "id is not a valid ObjectId";
      const sweetInfo = await sweetsCollection.findOne({ _id: ObjectId(sweetId) });
      if (!sweetInfo) return false;
      return sweetInfo;
    } catch (e) {
      throw e
    }
  },

  /* GET /sweets/:id */
  async getAllSweet(page){
    try {
      if (page === undefined){
        const sweetsCollection = await sweets();
        const sweetList = await sweetsCollection.find({}).toArray();
        if (!sweetList) throw 'Could not get all sweets';
        return sweetList;
      } else{
        if (isNaN(page) || page < 0) throw "page number invalid"
        const sweetsCollection = await sweets();
        const sweetList = await sweetsCollection.find({}).skip((page-1)*50).limit(50).toArray();
        if (sweetList.length == 0) throw 'no more sweets';
        return sweetList;
      } 
    } catch (e) {
      throw e
    }
  },

  /* POST /sweets*/
  async createSweet(userThatPosted, sweetText, sweetMood){
    try {
      if (!userThatPosted) throw "userThatPosted must be provided";
      if (!sweetText) throw "sweetText must be provided"
      if (!sweetMood) throw "sweetMood must be provided"
      const moodList = ["Happy",
                        "Sad",
                        "Angry",
                        "Excited",
                        "Surprised",
                        "Loved",
                        "Blessed",
                        "Greatful",
                        "Blissful",
                        "Silly",
                        "Chill",
                        "Motivated",
                        "Emotional",
                        "Annoyed",
                        "Lucky",
                        "Determined",
                        "Bored",
                        "Hungry",
                        "Disappointed",
                        "Worried"];
      if (!moodList.includes(sweetMood)) throw "invalid mood"
      const sweetsCollection = await sweets();

      let newSweet = {
        sweetText: sweetText,
        sweetMood: sweetMood,
        userThatPosted: userThatPosted,
        replies: [],
        likes:[]
      }
  
      const newInsertInformation = await sweetsCollection.insertOne(newSweet);
      if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
      return newInsertInformation.insertedId;
  } catch (e) {
    throw e
  }
  },  
  
  /* PATCH /sweets/:id */
  async updateSweet(sweetId, userThatUpdate, updateInfo){
    try{
      if (!sweetId) throw "productId must be provided";
      if (!ObjectId.isValid(sweetId)) throw "id is not a valid ObjectId";
      if (!userThatUpdate) throw "userThatUpdate must be provided";
      if (!updateInfo) throw "updatInfo must be provided";
      
      const sweetsCollection = await sweets();
      let sweetInfo = await this.getSweetById(ObjectId(sweetId));
      let userThatPosted = sweetInfo.userThatPosted._id.toString();
      if (userThatUpdate.toString() != userThatPosted) throw "not the same user";

      await sweetsCollection.updateOne({ _id: ObjectId(sweetId) }, { $set: updateInfo });
      return { sweetUpdated: true };
    } catch (e) {
      throw e
    }
  },

  /* POST /sweets/:id/replies */
  async createReply(sweetId, userThatPostedReply, reply){
    try {
      if (!sweetId) throw "productId must be provided";
      if (!ObjectId.isValid(sweetId)) throw "id is not a valid ObjectId";
      if (!userThatPostedReply) throw "userThatPostedReply must be provided";
      if (!reply) throw "reply must be provided";

      let replyAddInfo = {
        _id: ObjectId(),
        userThatPostedReply: userThatPostedReply,
        reply: reply
      }

      const sweetsCollection = await sweets();
      let sweetInfo = await this.getSweetById(ObjectId(sweetId));
      sweetInfo.replies.push(replyAddInfo);

      let updateInfo = {
        replies: sweetInfo.replies
      }
      await sweetsCollection.updateOne({ _id: ObjectId(sweetId) }, { $set: updateInfo });
      return { replyCreated: true };
    } catch (e) {
      throw e
    }
  },

  /* POST /sweets/:id/likes */
  async createLike(sweetId, userId){
    try {
      if (!sweetId) throw "productId must be provided";
      if (!ObjectId.isValid(sweetId)) throw "id is not a valid ObjectId";
      if (!userId) throw "userId must be provided";
    
      const sweetsCollection = await sweets();
      let sweetInfo = await this.getSweetById(ObjectId(sweetId));
      if(sweetInfo.likes.includes(userId)){
        for (let i = 0; i<sweetInfo.likes.length; i++) {
          if (userId == sweetInfo.likes[i]){
            sweetInfo.likes.splice(i,1);
          }
        }
      } else{
        sweetInfo.likes.push(userId.toString());
      }
     
      let updateInfo = {
        likes: sweetInfo.likes
      }
      await sweetsCollection.updateOne({ _id: ObjectId(sweetId) }, { $set: updateInfo });
      return { likeCreated: true };
    } catch (e) {
      throw e
    }
  },
  
  /* DELETE /sweets/:sweetId/:replyId */
  async deleteReply(sweetId, replyId, userDelete){
    try {
      if (!sweetId) throw "productId must be provided";
      if (!ObjectId.isValid(sweetId)) throw "id is not a valid ObjectId";
      if (!replyId) throw "replyId must be provided";
      if (!userDelete) throw "replyId must be provided";
    
      const sweetsCollection = await sweets();
      let sweetInfo = await this.getSweetById(ObjectId(sweetId));
      let repliesUpdate = sweetInfo.replies;

      for (let i = 0; i<repliesUpdate.length; i++) {
        if (repliesUpdate[i]._id == replyId.toString()) {
          if (userDelete !== repliesUpdate[i].userThatPostedReply.username){
            throw "not the same user";
          }
          repliesUpdate.splice(i,1);
        }
      }
      
      let updateInfo = {
        replies: repliesUpdate
      }
      await sweetsCollection.updateOne({ _id: ObjectId(sweetId) }, { $set: updateInfo });
      return { replyDeleted: true };
    } catch (e) {
      throw e
    }
  },

}

module.exports = exportedMethods;