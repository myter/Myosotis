import {FarRef, PSClient, PubSubTag} from "spiders.captain"
import {Server} from "../server/Server";
import {
    GetListsRequest, GetListsResponse, LoginReply, LoginRequest, NewUserRequest, NewUserResponse,
    PubSubTopics
} from "../data/PubSub";

export class ServerComm{
    server      : FarRef<Server>
    psClient    : PSClient
    psTopics    : PubSubTopics
    userName    : string
    myToken

    constructor(psClient : PSClient,topicConstructor : {new(val : string) : PubSubTag},server){
        this.psClient = psClient
        this.psTopics = new PubSubTopics(topicConstructor)
        this.server   = server
    }

    //////////////////////////////////////
    // User Management                  //
    //////////////////////////////////////

    requestLogin(userName : string,password : string){
        this.userName = userName
        this.psClient.publish(new LoginRequest(userName,password),this.psTopics.LoginReqTopic)
        return new Promise((resolve)=>{
            this.psClient.subscribe(this.psTopics.LoginRespTopic).each((response : LoginReply)=>{
                if(response.name == userName){
                    this.myToken = response.token
                    resolve(response.token)
                }
            })
        })
        /*return this.server.login(userName,password).then((token)=>{
            if(token){
                this.myToken    = token
                this.userName   = userName
            }
            return token
        })*/
    }

    requestNewUser(userName : string,password : string){
        this.psClient.publish(new NewUserRequest(userName,password),this.psTopics.NewUserReqTopic)
        return new Promise((resolve)=>{
            this.psClient.subscribe(this.psTopics.NewUserRespTopic).each((response : NewUserResponse)=>{
                if(response.name == userName){
                    this.myToken = response.token
                    resolve(response.token)
                }
            })
        })
        /*return this.server.newUser(userName,password).then((token)=>{
            this.myToken    = token
            this.userName   = userName
        })*/
    }

    //////////////////////////////////////
    // Lists                            //
    //////////////////////////////////////

    requestMyLists(){
        this.psClient.publish(new GetListsRequest(this.userName,this.myToken),this.psTopics.GetListsReqTopic)
        return new Promise((resolve)=>{
            this.psClient.subscribe(this.psTopics.GetListsRespTopic).each((response : GetListsResponse)=>{
                if(response.userName == this.userName){
                    resolve([response.lists,response.boughList])
                }
            })
        })
        //return this.server.getListsFor(this.myToken,this.userName)
    }

}