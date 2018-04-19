import {CAPplication, Consistent, PSClient} from "spiders.captain";
import {
    GetListsRequest, GetListsResponse, GoOfflineRequest, GoOfflineResponse, GoOnlineRequest, LoginReply, LoginRequest,
    NewUserRequest,
    NewUserResponse,
    PubSubTopics
} from "../data/PubSub";
import {BoughtList, GroceryList, GroceryListC, UserLists, UserListsC} from "../data/APs";
import {sign, verify} from "jsonwebtoken";
import {DBActor} from "./DBActor";

export class Server2 extends CAPplication {
    dbActor
    userLists : Map<string,UserListsC>
    psClient  : PSClient
    psTopics  : PubSubTopics
    boughList : BoughtList

    constructor(port : number,pathToHtml : string,pathToClientJS : string){
        //super("spitter.soft.vub.ac.be",8000)
        super()
        this.libs.setupPSServer()
        //this.psClient   = this.libs.setupPSClient("spitter.soft.vub.ac.be",8000)
        this.psClient   = this.libs.setupPSClient()
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
            //TODO refactor before pushing to git
            verify(token,"SOMESECRETTODOREFACTOR",(err)=>{
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
                            //TODO refactor before pushing to git
                            let token = sign({},"SOMESECRETTODOREFACTOR")
                            this.psClient.publish(new LoginReply(loginRequest.name,verified,token,2),this.psTopics.LoginRespTopic)
                        }
                        else{
                            this.psClient.publish(new LoginReply(loginRequest.name,verified,"",2),this.psTopics.LoginRespTopic)
                        }
                    })
                }
                else{
                    this.psClient.publish(new LoginReply(loginRequest.name,false,"",2),this.psTopics.LoginRespTopic)
                }
            })
        })

        //New User
        this.psClient.subscribe(this.psTopics.NewUserReqTopic).each((request : NewUserRequest)=>{
            this.dbActor.addUser(request.name,request.password).then(()=>{
                let token = sign({},"SOMESECRETTODOREFACTOR")
                this.psClient.publish(new NewUserResponse(request.name,token),this.psTopics.NewUserRespTopic)
            })
        })

        //////////////////////////////////////
        // Lists                            //
        //////////////////////////////////////

        this.psClient.subscribe(this.psTopics.GetListsReqTopic).each((request : GetListsRequest)=>{
            this.checkTokenizedRequest(request.token,()=>{
                if(this.userLists.has(request.userName)){
                    this.psClient.publish(new GetListsResponse(request.userName,this.userLists.get(request.userName) as any,this.boughList),this.psTopics.GetListsRespTopic)
                }
                else{
                    let newUserLists = new UserListsC(request.userName)
                    this.userLists.set(request.userName,newUserLists)
                    this.psClient.publish(new GetListsResponse(request.userName,newUserLists as any,this.boughList),this.psTopics.GetListsRespTopic)
                }
            })
        })


        //////////////////////////////////////
        // Connectivity                     //
        //////////////////////////////////////

        this.psClient.subscribe(this.psTopics.GoOfflineReqTopic).each((request : GoOfflineRequest)=>{
            this.checkTokenizedRequest(request.token,()=>{
                let userLists   = this.userLists.get(request.userName);
                this.libs.thaw(userLists as any).then((evUserLists : UserLists)=>{
                    let thaws = evUserLists.lists.map((list)=>{return this.libs.thaw(list as any)})
                    Promise.all(thaws).then((evLists)=>{
                        evUserLists.lists = evLists
                        this.psClient.publish(new GoOfflineResponse(request.userName,evUserLists),this.psTopics.GoOfflineRespTopic)
                    })
                })
            })
        })

        this.psClient.subscribe(this.psTopics.GoOnlineReqTopic).each((request : GoOnlineRequest)=>{
            let frozenLists = request.lists.lists.map((list)=>{return this.libs.freeze(list as any)})
            delete request.lists.lists
            let frozenUserLists : UserListsC = this.libs.freeze(request.lists as any)
            frozenUserLists.lists = frozenLists
            this.userLists.get(request.userName).merge(frozenUserLists)
            this.psClient.publish(new GoOfflineResponse(request.userName,frozenUserLists as any),this.psTopics.GoOnlineRespTopic)
        })
    }
}