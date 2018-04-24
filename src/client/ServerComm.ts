import {FarRef, PSClient, PubSubTag} from "spiders.captain"
import {Server} from "../server/Server";
import {
    GetListsRequest, GetListsResponse, GoOfflineRequest, GoOfflineResponse, GoOnlineRequest, GoOnlineResponse,
    LoginReply, LoginRequest,
    NewUserRequest,
    NewUserResponse,
    PubSubTopics
} from "../data/PubSub";
import {UserLists} from "../data/APs";

export class ServerComm{
    psClient    : PSClient
    psTopics    : PubSubTopics
    userName    : string
    myToken

    constructor(psClient : PSClient,topicConstructor : {new(val : string) : PubSubTag}){
        this.psClient = psClient
        this.psTopics = new PubSubTopics(topicConstructor)
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
                    resolve([response.token,response.serverType])
                }
            })
        })
    }

    requestNewUser(userName : string,password : string){
        this.psClient.publish(new NewUserRequest(userName,password),this.psTopics.NewUserReqTopic)
        return new Promise((resolve)=>{
            this.psClient.subscribe(this.psTopics.NewUserRespTopic).each((response : NewUserResponse)=>{
                if(response.name == userName){
                    this.userName = userName
                    this.myToken = response.token
                    resolve([response.token,response.serverType])
                }
            })
        })
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
    }

    //////////////////////////////////////
    // Connectivity (Myo2)              //
    //////////////////////////////////////

    requestGoOffline(){
        this.psClient.publish(new GoOfflineRequest(this.userName,this.myToken),this.psTopics.GoOfflineReqTopic)
        return new Promise((resolve)=>{
            this.psClient.subscribe(this.psTopics.GoOfflineRespTopic).each((response : GoOfflineResponse)=>{
                if(response.userName == this.userName){
                    resolve(response.lists)
                }
            })
        })
    }

    requestGoOnline(lists : UserLists){
        this.psClient.publish(new GoOnlineRequest(this.userName,this.myToken,lists),this.psTopics.GoOnlineReqTopic)
        return new Promise((resolve)=>{
            this.psClient.subscribe(this.psTopics.GoOnlineRespTopic).each((response : GoOnlineResponse)=>{
                if(response.userName == this.userName){
                    resolve(response.lists)
                }
            })
        })
    }

}