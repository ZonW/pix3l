const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcryptjs = require('bcryptjs');
const ObjectId = require('mongodb').ObjectId;

const exportedMethods = {
    checkUsername(username) {
        if (typeof username !== 'string') throw 'username must be string';
        username = username.trim();
        if (username.length == 0) throw 'username is not a valid string';
        return username
    },

    checkPassword(password) {
        if (typeof password !== 'string') throw 'password must be string';
        password = password.trim();
        if (password.length == 0) throw 'password is not a valid string';
        return password;
    },

    checkName(name) {
        if (typeof name !== 'string') throw 'password must be string';
        name = name.trim();
        if (name.length == 0) throw 'password is not a valid string';
        return name;
    },

    async createUser(
        name,
        username,
        password
    ) {
        if (!name) throw 'name must be provided';
        if (!username) throw 'username must be provided';
        if (!password) throw 'password must be provided';
  
        const saltRounds = 6;
        name = this.checkName(name);
        username = this.checkUsername(username);
        password = this.checkPassword(password);
        password = await bcryptjs.hash(password, saltRounds);
        let newUser = {
            name: name,
            username: username,
            password: password,
        };
        const usersCollection = await users();
        const newInsertInformation = await usersCollection.insertOne(newUser);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        return { userInserted: true };
    },

    async getUserByName(username) {
        const usersCollection = await users();
        const username_lower = username.toLowerCase();
        const userInfo = await usersCollection.findOne({ username: username_lower });
        if (!userInfo) throw "user not found";
        return userInfo;
    },

    async getUserById(userId) {
        const usersCollection = await users();
        if (!ObjectId.isValid(userId)) throw 'id is not a valid ObjectId';
        const userInfo = await usersCollection.findOne({ _id: ObjectId(userId) });
        if (!userInfo) throw "user not found";
        return userInfo;
    },

    async checkUserLogin(username, password) {
        if (!username) throw 'username must be provided';
        if (!password) throw 'password must be provided';

        const userInfo = await this.getUserByName(username);
        if (!userInfo) throw 'user not found';
        const pass = await bcryptjs.compare(password, userInfo.password);
        if (!pass) throw 'password is invalid';
        
        return { authenticated: true };
    },
};

module.exports = exportedMethods;
