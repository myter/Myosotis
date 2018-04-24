Object.defineProperty(exports, "__esModule", { value: true });
const PubSub_1 = require("../data/PubSub");
class ServerComm {
    constructor(psClient, topicConstructor) {
        this.psClient = psClient;
        this.psTopics = new PubSub_1.PubSubTopics(topicConstructor);
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
                    resolve([response.token, response.serverType]);
                }
            });
        });
    }
    requestNewUser(userName, password) {
        this.psClient.publish(new PubSub_1.NewUserRequest(userName, password), this.psTopics.NewUserReqTopic);
        return new Promise((resolve) => {
            this.psClient.subscribe(this.psTopics.NewUserRespTopic).each((response) => {
                if (response.name == userName) {
                    this.userName = userName;
                    this.myToken = response.token;
                    resolve([response.token, response.serverType]);
                }
            });
        });
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
    }
    //////////////////////////////////////
    // Connectivity (Myo2)              //
    //////////////////////////////////////
    requestGoOffline() {
        this.psClient.publish(new PubSub_1.GoOfflineRequest(this.userName, this.myToken), this.psTopics.GoOfflineReqTopic);
        return new Promise((resolve) => {
            this.psClient.subscribe(this.psTopics.GoOfflineRespTopic).each((response) => {
                if (response.userName == this.userName) {
                    resolve(response.lists);
                }
            });
        });
    }
    requestGoOnline(lists) {
        this.psClient.publish(new PubSub_1.GoOnlineRequest(this.userName, this.myToken, lists), this.psTopics.GoOnlineReqTopic);
        return new Promise((resolve) => {
            this.psClient.subscribe(this.psTopics.GoOnlineRespTopic).each((response) => {
                if (response.userName == this.userName) {
                    resolve(response.lists);
                }
            });
        });
    }
}
exports.ServerComm = ServerComm;
//# sourceMappingURL=ServerComm.js.map