Object.defineProperty(exports, "__esModule", { value: true });
const PubSub_1 = require("../data/PubSub");
class ServerComm {
    constructor(psClient, topicConstructor, server) {
        this.psClient = psClient;
        this.psTopics = new PubSub_1.PubSubTopics(topicConstructor);
        this.server = server;
    }
    //////////////////////////////////////
    // User Management                  //
    //////////////////////////////////////
    requestLogin(userName, password) {
        this.userName = userName;
        this.psClient.publish(new PubSub_1.LoginRequest(userName, password), this.psTopics.LoginReqTopic);
        return new Promise((resolve) => {
            this.psClient.subscribe(this.psTopics.LoginRespTopic).each((response) => {
                if (response.name == userName) {
                    this.myToken = response.token;
                    resolve(response.token);
                }
            });
        });
        /*return this.server.login(userName,password).then((token)=>{
            if(token){
                this.myToken    = token
                this.userName   = userName
            }
            return token
        })*/
    }
    requestNewUser(userName, password) {
        this.psClient.publish(new PubSub_1.NewUserRequest(userName, password), this.psTopics.NewUserReqTopic);
        return new Promise((resolve) => {
            this.psClient.subscribe(this.psTopics.NewUserRespTopic).each((response) => {
                if (response.name == userName) {
                    this.myToken = response.token;
                    resolve(response.token);
                }
            });
        });
        /*return this.server.newUser(userName,password).then((token)=>{
            this.myToken    = token
            this.userName   = userName
        })*/
    }
    //////////////////////////////////////
    // Lists                            //
    //////////////////////////////////////
    requestMyLists() {
        this.psClient.publish(new PubSub_1.GetListsRequest(this.userName, this.myToken), this.psTopics.GetListsReqTopic);
        return new Promise((resolve) => {
            this.psClient.subscribe(this.psTopics.GetListsRespTopic).each((response) => {
                if (response.userName == this.userName) {
                    resolve([response.lists, response.boughList]);
                }
            });
        });
        //return this.server.getListsFor(this.myToken,this.userName)
    }
}
exports.ServerComm = ServerComm;
//# sourceMappingURL=ServerComm.js.map