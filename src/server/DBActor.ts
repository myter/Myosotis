import {Actor} from "spiders.captain"
import {Connection, Model, Mongoose} from "mongoose";

import mongoose = require('mongoose')

/////////////////////////////////////////////////////////
// Models                                              //
/////////////////////////////////////////////////////////

//Keeping passwords as string is ridiculous, I know but this is just a use case application
interface User{
    name        : string
    password    : string
}

interface UserModel extends User,mongoose.Document{}


/////////////////////////////////////////////////////////
// Actor                                               //
/////////////////////////////////////////////////////////

export class DBActor extends Actor{
    db          : Connection
    UserModel   : Model<UserModel>
    thisDir

    constructor(){
        super()
        this.thisDir = __dirname
    }

    init(){
        let conf                = require(this.thisDir+"/../ExampleAppConfig.json")
        let mongoose            = require('mongoose')
        let mongoURI            = "mongodb://"+ conf.DBLogin + ":"+ conf.DBPass + "@" + conf.DBAddress + ":" + conf.DBPort + "/" + conf.DBName
        mongoose.connect(mongoURI)
        this.db                 = mongoose.connection
        this.db.on('error',console.error.bind(console, 'connection error:'))
        this.db.on('open',()=>{
            console.log("Connected to test database")
            this.instantiateModels(mongoose)
        })
    }

    instantiateModels(mongoose : Mongoose){
        let userSchema          = new mongoose.Schema({
            name : String,
            password : String
        })
        this.UserModel          = mongoose.model('User',userSchema)
    }

    ////////////////////////
    // Users              //
    ////////////////////////

    hasUser(userName : string){
        return new Promise((resolve)=>{
            this.UserModel.findOne({name : userName},(err,user)=>{
                if(err)console.error(err)
                if(user){
                    resolve(true)
                }
                else{
                    resolve(false)
                }
            })
        })
    }

    addUser(userName : string,password){
        return new Promise((resolve)=>{
            let toStore = new this.UserModel({
                name        : userName,
                password    : password
            })
            console.log("Saving user: " + userName + " , " + password)
            toStore.save((err)=>{
                if(err){
                    console.error(err)
                    resolve(false)
                }
                else{
                    resolve(true)
                }
            })
        })
    }

    verifyUser(userName : string,supposedPassword : string){
        return new Promise((resolve)=>{
            this.UserModel.findOne({name : userName,password : supposedPassword},(err,user)=>{
                if(err)console.error(err)
                if(user){
                    resolve(true)
                }
                else{
                    resolve(false)
                }
            })
        })
    }
}