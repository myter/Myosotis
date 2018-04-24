import {Available, PubSubTag} from "spiders.captain";
import {BoughtList, UserLists, UserListsC} from "./APs";

export class PubSubTopics {
    topicConstructor
    LoginReqTopic       : PubSubTag
    LoginRespTopic      : PubSubTag
    NewUserReqTopic     : PubSubTag
    NewUserRespTopic    : PubSubTag
    GetListsReqTopic    : PubSubTag
    GetListsRespTopic   : PubSubTag
    GoOfflineReqTopic   : PubSubTag
    GoOfflineRespTopic  : PubSubTag
    GoOnlineReqTopic    : PubSubTag
    GoOnlineRespTopic   : PubSubTag


    constructor(topicConstructor){
        this.topicConstructor   = topicConstructor
        this.LoginReqTopic      = new this.topicConstructor("_LOGIN_REQ_")
        this.LoginRespTopic     = new this.topicConstructor("_LOGIN_RESP_")
        this.NewUserReqTopic    = new this.topicConstructor("_NEW_USER_REQ_")
        this.NewUserRespTopic   = new this.topicConstructor("_NEW_USER_RESP_")
        this.GetListsReqTopic   = new this.topicConstructor("_GET_LIST_REQ_")
        this.GetListsRespTopic  = new this.topicConstructor("_GET_LIST_RESP_")
        this.GoOfflineReqTopic  = new this.topicConstructor("_GO_OFFLINE_REQ_")
        this.GoOfflineRespTopic = new this.topicConstructor("_GO_OFFLINE_RESP_")
        this.GoOnlineReqTopic   = new this.topicConstructor("_GO_ONLINE_REQ_")
        this.GoOnlineRespTopic  = new this.topicConstructor("_GO_ONLINE_RESP_")
    }
}

export class LoginRequest extends Available{
    name
    password

    constructor(name,password){
        super()
        this.name       = name
        this.password   = password
    }
}

export class LoginReply extends Available{
    name
    ok
    token
    serverType

    constructor(name : string,ok : boolean,token,serverType){
        super()
        this.name       = name
        this.ok         = ok
        this.token      = token
        this.serverType = serverType
    }
}

export class NewUserRequest extends Available{
    name
    password

    constructor(name,password){
        super()
        this.name       = name
        this.password   = password
    }
}

export class NewUserResponse extends Available{
    name
    token
    serverType

    constructor(name : string,token,serverType){
        super()
        this.name           = name
        this.token          = token
        this.serverType     = serverType
    }
}

export class GetListsRequest extends Available{
    userName
    token

    constructor(userName,token){
        super()
        this.userName   = userName
        this.token      = token
    }
}

export class GetListsResponse extends Available{
    userName
    lists       : UserLists
    boughList   : BoughtList

    constructor(userName : string,lists : UserLists,boughtList : BoughtList){
        super()
        this.userName   = userName
        this.lists      = lists
        this.boughList  = boughtList
    }
}

export class GoOfflineRequest extends Available{
    userName
    token
    constructor(userName,token){
        super()
        this.userName   = userName
        this.token      = token
    }
}

export class GoOfflineResponse extends Available{
    userName
    lists     : UserLists

    constructor(userName : string,lists : UserLists){
        super()
        this.userName   = userName
        this.lists      = lists
    }
}

export class GoOnlineRequest extends Available{
    userName
    token
    lists    : UserLists

    constructor(userName : string,token,lists : UserLists){
        super()
        this.userName   = userName
        this.token      = token
        this.lists      = lists
    }
}

export class GoOnlineResponse extends Available{
    userName
    lists  : UserListsC

    constructor(userName : string,lists : UserListsC){
        super()
        this.userName   = userName
        this.lists      = lists
    }
}