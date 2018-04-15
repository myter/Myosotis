import {Available, PubSubTag} from "spiders.captain";
import {BoughtList, UserLists} from "./APs";

export class PubSubTopics {
    topicConstructor
    LoginReqTopic       : PubSubTag
    LoginRespTopic      : PubSubTag
    NewUserReqTopic     : PubSubTag
    NewUserRespTopic    : PubSubTag
    GetListsReqTopic    : PubSubTag
    GetListsRespTopic   : PubSubTag


    constructor(topicConstructor){
        this.topicConstructor   = topicConstructor
        this.LoginReqTopic      = new this.topicConstructor("_LOGIN_REQ_")
        this.LoginRespTopic     = new this.topicConstructor("_LOGIN_RESP_")
        this.NewUserReqTopic    = new this.topicConstructor("_NEW_USER_REQ_")
        this.NewUserRespTopic   = new this.topicConstructor("_NEW_USER_RESP_")
        this.GetListsReqTopic   = new this.topicConstructor("_GET_LIST_REQ_")
        this.GetListsRespTopic  = new this.topicConstructor("_GET_LIST_RESP_")
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

    constructor(name : string,ok : boolean,token?){
        super()
        this.name   = name
        this.ok     = ok
        this.token  = token
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

    constructor(name : string,token){
        super()
        this.name   = name
        this.token  = token
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