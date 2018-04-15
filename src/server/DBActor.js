Object.defineProperty(exports, "__esModule", { value: true });
const spiders_captain_1 = require("spiders.captain");
/////////////////////////////////////////////////////////
// Actor                                               //
/////////////////////////////////////////////////////////
class DBActor extends spiders_captain_1.Actor {
    init() {
        let mongoose = require('mongoose');
        //TODO needs to be obfuscated before pushing to public git
        mongoose.connect('mongodb://app:app@localhost:27018/test');
        this.db = mongoose.connection;
        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.on('open', () => {
            console.log("Connected to test database");
            this.instantiateModels(mongoose);
        });
    }
    instantiateModels(mongoose) {
        let userSchema = new mongoose.Schema({
            name: String,
            password: String
        });
        this.UserModel = mongoose.model('User', userSchema);
    }
    ////////////////////////
    // Users              //
    ////////////////////////
    hasUser(userName) {
        return new Promise((resolve) => {
            this.UserModel.findOne({ name: userName }, (err, user) => {
                if (err)
                    console.error(err);
                if (user) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }
    addUser(userName, password) {
        return new Promise((resolve) => {
            let toStore = new this.UserModel({
                name: userName,
                password: password
            });
            console.log("Saving user: " + userName + " , " + password);
            toStore.save((err) => {
                if (err) {
                    console.error(err);
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    verifyUser(userName, supposedPassword) {
        return new Promise((resolve) => {
            this.UserModel.findOne({ name: userName, password: supposedPassword }, (err, user) => {
                if (err)
                    console.error(err);
                if (user) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }
}
exports.DBActor = DBActor;
//# sourceMappingURL=DBActor.js.map