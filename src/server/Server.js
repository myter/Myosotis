Object.defineProperty(exports, "__esModule", { value: true });
const spiders_captain_1 = require("spiders.captain");
const DBActor_1 = require("./DBActor");
const jsonwebtoken_1 = require("jsonwebtoken");
const APs_1 = require("../data/APs");
const PubSub_1 = require("../data/PubSub");
class Server extends spiders_captain_1.CAPplication {
    constructor(port, pathToHtml, pathToClientJS) {
        super();
        this.libs.setupPSServer();
        this.psClient = this.libs.setupPSClient();
        this.psTopics = new PubSub_1.PubSubTopics(this.libs.PubSubTag);
        this.userLists = new Map();
        this.libs.serveApp(pathToHtml, pathToClientJS, "bundle.js", port);
        console.log("Server running on port " + port);
        this.dbActor = this.spawnActor(DBActor_1.DBActor);
        this.boughList = new APs_1.BoughtList();
        this.installPSListeners();
    }
    /////////////////////////////////////////////////////////
    // Security                                            //
    /////////////////////////////////////////////////////////
    verifyToken(token) {
        return new Promise((resolve) => {
            //TODO refactor before pushing to git
            jsonwebtoken_1.verify(token, "SOMESECRETTODOREFACTOR", (err) => {
                return resolve(!err);
            });
        });
    }
    getTokenError() {
        return new Error("Unverified token provided for request");
    }
    checkTokenizedRequest(token, performRequest) {
        return this.verifyToken(token).then((ok) => {
            if (ok) {
                return performRequest();
            }
            else {
                throw this.getTokenError();
            }
        });
    }
    installPSListeners() {
        //////////////////////////////////////
        // Users                            //
        //////////////////////////////////////
        //Login
        this.psClient.subscribe(this.psTopics.LoginReqTopic).each((loginRequest) => {
            this.dbActor.hasUser(loginRequest.name).then((exists) => {
                if (exists) {
                    this.dbActor.verifyUser(loginRequest.name, loginRequest.password).then((verified) => {
                        if (verified) {
                            //TODO refactor before pushing to git
                            let token = jsonwebtoken_1.sign({}, "SOMESECRETTODOREFACTOR");
                            this.psClient.publish(new PubSub_1.LoginReply(loginRequest.name, verified, token), this.psTopics.LoginRespTopic);
                        }
                        else {
                            this.psClient.publish(new PubSub_1.LoginReply(loginRequest.name, verified), this.psTopics.LoginRespTopic);
                        }
                    });
                }
                else {
                    this.psClient.publish(new PubSub_1.LoginReply(loginRequest.name, false), this.psTopics.LoginRespTopic);
                }
            });
        });
        //New User
        this.psClient.subscribe(this.psTopics.NewUserReqTopic).each((request) => {
            this.dbActor.addUser(request.name, request.password).then(() => {
                let token = jsonwebtoken_1.sign({}, "SOMESECRETTODOREFACTOR");
                this.psClient.publish(new PubSub_1.NewUserResponse(request.name, token), this.psTopics.NewUserRespTopic);
            });
        });
        //////////////////////////////////////
        // Lists                            //
        //////////////////////////////////////
        this.psClient.subscribe(this.psTopics.GetListsReqTopic).each((request) => {
            this.checkTokenizedRequest(request.token, () => {
                if (this.userLists.has(request.userName)) {
                    this.psClient.publish(new PubSub_1.GetListsResponse(request.userName, this.userLists.get(request.userName), this.boughList), this.psTopics.GetListsRespTopic);
                }
                else {
                    let newUserLists = new APs_1.UserLists(request.userName);
                    newUserLists.onCommit((lists) => {
                        console.log("New commit value for list on server !!!");
                        lists.lists.forEach((list) => {
                            console.log(list.listName);
                        });
                    });
                    this.userLists.set(request.userName, newUserLists);
                    this.psClient.publish(new PubSub_1.GetListsResponse(request.userName, newUserLists, this.boughList), this.psTopics.GetListsRespTopic);
                }
            });
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map