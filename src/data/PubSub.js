Object.defineProperty(exports, "__esModule", { value: true });
const spiders_captain_1 = require("spiders.captain");
class PubSubTopics {
    constructor(topicConstructor) {
        this.topicConstructor = topicConstructor;
        this.LoginReqTopic = new this.topicConstructor("_LOGIN_REQ_");
        this.LoginRespTopic = new this.topicConstructor("_LOGIN_RESP_");
        this.NewUserReqTopic = new this.topicConstructor("_NEW_USER_REQ_");
        this.NewUserRespTopic = new this.topicConstructor("_NEW_USER_RESP_");
        this.GetListsReqTopic = new this.topicConstructor("_GET_LIST_REQ_");
        this.GetListsRespTopic = new this.topicConstructor("_GET_LIST_RESP_");
        this.GoOfflineReqTopic = new this.topicConstructor("_GO_OFFLINE_REQ_");
        this.GoOfflineRespTopic = new this.topicConstructor("_GO_OFFLINE_RESP_");
        this.GoOnlineReqTopic = new this.topicConstructor("_GO_ONLINE_REQ_");
        this.GoOnlineRespTopic = new this.topicConstructor("_GO_ONLINE_RESP_");
    }
}
exports.PubSubTopics = PubSubTopics;
class LoginRequest extends spiders_captain_1.Available {
    constructor(name, password) {
        super();
        this.name = name;
        this.password = password;
    }
}
exports.LoginRequest = LoginRequest;
class LoginReply extends spiders_captain_1.Available {
    constructor(name, ok, token, serverType) {
        super();
        this.name = name;
        this.ok = ok;
        this.token = token;
        this.serverType = serverType;
    }
}
exports.LoginReply = LoginReply;
class NewUserRequest extends spiders_captain_1.Available {
    constructor(name, password) {
        super();
        this.name = name;
        this.password = password;
    }
}
exports.NewUserRequest = NewUserRequest;
class NewUserResponse extends spiders_captain_1.Available {
    constructor(name, token, serverType) {
        super();
        this.name = name;
        this.token = token;
        this.serverType = serverType;
    }
}
exports.NewUserResponse = NewUserResponse;
class GetListsRequest extends spiders_captain_1.Available {
    constructor(userName, token) {
        super();
        this.userName = userName;
        this.token = token;
    }
}
exports.GetListsRequest = GetListsRequest;
class GetListsResponse extends spiders_captain_1.Available {
    constructor(userName, lists, boughtList) {
        super();
        this.userName = userName;
        this.lists = lists;
        this.boughList = boughtList;
    }
}
exports.GetListsResponse = GetListsResponse;
class GoOfflineRequest extends spiders_captain_1.Available {
    constructor(userName, token) {
        super();
        this.userName = userName;
        this.token = token;
    }
}
exports.GoOfflineRequest = GoOfflineRequest;
class GoOfflineResponse extends spiders_captain_1.Available {
    constructor(userName, lists) {
        super();
        this.userName = userName;
        this.lists = lists;
    }
}
exports.GoOfflineResponse = GoOfflineResponse;
class GoOnlineRequest extends spiders_captain_1.Available {
    constructor(userName, token, lists) {
        super();
        this.userName = userName;
        this.token = token;
        this.lists = lists;
    }
}
exports.GoOnlineRequest = GoOnlineRequest;
class GoOnlineResponse extends spiders_captain_1.Available {
    constructor(userName, lists) {
        super();
        this.userName = userName;
        this.lists = lists;
    }
}
exports.GoOnlineResponse = GoOnlineResponse;
//# sourceMappingURL=PubSub.js.map