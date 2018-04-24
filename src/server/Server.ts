import {CAPplication, PSClient} from "spiders.captain";
import {DBActor} from "./DBActor";
import {sign, verify} from "jsonwebtoken";
import {BoughtList, GroceryList, UserLists} from "../data/APs";
import {
    GetListsRequest, GetListsResponse, LoginReply, LoginRequest, NewUserRequest, NewUserResponse,
    PubSubTopics
} from "../data/PubSub";

let conf = require("../ExampleAppConfig.json")


export class Server extends CAPplication {
    dbActor
    userLists : Map<string,UserLists>
    psClient  : PSClient
    psTopics  : PubSubTopics
    boughList : BoughtList

    constructor(port : number,pathToHtml : string,pathToClientJS : string){
        super(conf.ServerAddress,conf.ServerSocketPort)
        this.libs.setupPSServer()
        this.psClient   = this.libs.setupPSClient(conf.ServerAddress,conf.ServerSocketPort)
        this.psTopics   = new PubSubTopics(this.libs.PubSubTag)
        this.userLists  = new Map()
        this.libs.serveApp(pathToHtml,pathToClientJS,"bundle.js",port)
        console.log("Server running on port " + port)
        this.dbActor    = this.spawnActor(DBActor)
        this.boughList  = new BoughtList()
        this.installPSListeners()
    }

    /////////////////////////////////////////////////////////
    // Security                                            //
    /////////////////////////////////////////////////////////

    verifyToken(token) : Promise<boolean>{
        return new Promise((resolve)=>{
            verify(token,conf.JSONWebTokenSecret,(err)=>{
                return resolve(!err)
            })
        })
    }

    getTokenError(){
        return new Error("Unverified token provided for request")
    }

    checkTokenizedRequest(token,performRequest : ()=>any) : Promise<any>{
        return this.verifyToken(token).then((ok)=>{
            if(ok){
                return performRequest()
            }
            else{
                throw this.getTokenError()
            }
        })
    }

    installPSListeners(){
        //////////////////////////////////////
        // Users                            //
        //////////////////////////////////////

        //Login
        this.psClient.subscribe(this.psTopics.LoginReqTopic).each((loginRequest : LoginRequest)=>{
            this.dbActor.hasUser(loginRequest.name).then((exists)=>{
                if(exists){
                    this.dbActor.verifyUser(loginRequest.name,loginRequest.password).then((verified)=>{
                        if(verified){
                            let token = sign({},conf.JSONWebTokenSecret)
                            this.psClient.publish(new LoginReply(loginRequest.name,verified,token,1),this.psTopics.LoginRespTopic)
                        }
                        else{
                            this.psClient.publish(new LoginReply(loginRequest.name,verified,"",1),this.psTopics.LoginRespTopic)
                        }
                    })
                }
                else{
                    this.psClient.publish(new LoginReply(loginRequest.name,false,"",1),this.psTopics.LoginRespTopic)
                }
            })
        })

        //New User
        this.psClient.subscribe(this.psTopics.NewUserReqTopic).each((request : NewUserRequest)=>{
            this.dbActor.addUser(request.name,request.password).then(()=>{
                let token = sign({},conf.JSONWebTokenSecret)
                this.psClient.publish(new NewUserResponse(request.name,token),this.psTopics.NewUserRespTopic)
            })
        })

        //////////////////////////////////////
        // Lists                            //
        //////////////////////////////////////

        this.psClient.subscribe(this.psTopics.GetListsReqTopic).each((request : GetListsRequest)=>{
            this.checkTokenizedRequest(request.token,()=>{
                if(this.userLists.has(request.userName)){
                    this.psClient.publish(new GetListsResponse(request.userName,this.userLists.get(request.userName),this.boughList),this.psTopics.GetListsRespTopic)
                }
                else{
                    let newUserLists = new UserLists(request.userName)
                    newUserLists.onCommit((lists : UserLists)=>{
                        console.log("New commit value for list on server !!!")
                        lists.lists.forEach((list : GroceryList)=>{
                            console.log(list.listName)
                        })
                    })
                    this.userLists.set(request.userName,newUserLists)
                    this.psClient.publish(new GetListsResponse(request.userName,newUserLists,this.boughList),this.psTopics.GetListsRespTopic)
                }
            })
        })
    }
}