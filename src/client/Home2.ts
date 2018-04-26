import {MyoScreen} from "./MyoScreen";
import {MyoClient} from "./Client";
import {NewItemModal} from "./NewItemModal";
import {FarRef} from "spiders.captain";
import {BoughtList, GroceryList, GroceryListC, UserLists, UserListsC} from "../data/APs";
import {NewListModal} from "./NewListModal";

export class HomeScreen2 extends MyoScreen{
    newListButton       : JQuery<HTMLElement>
    newItemButton       : JQuery<HTMLElement>
    myListsColl         : JQuery<HTMLElement>
    selectedListColl    : JQuery<HTMLElement>
    listInspector       : JQuery<HTMLElement>
    currentListHeader   : JQuery<HTMLElement>
    offlineModeButton   : JQuery<HTMLElement>
    onlineModeButton    : JQuery<HTMLElement>
    newListModal        : NewListModal
    newItemModal        : NewItemModal
    myLists             : UserListsC
    currentList         : GroceryListC
    currentListName     : string
    waitingTriggers     : Array<()=>any>
    boughList           : FarRef<BoughtList>
    online              : boolean

    constructor(client : MyoClient){
        super(client,$("#screen_home"),$("#nav_home"))
        this.newListButton          = $("#btn_home_new_list")
        this.newItemButton          = $("#btn_home_new_item")
        this.myListsColl            = $("#nav_all")
        this.selectedListColl       = $("#coll_home_selected_list")
        this.listInspector          = $("#list_inspector")
        this.currentListHeader      = $("#list_content_header")
        this.offlineModeButton      = $("#btn_home_offline_mode")
        this.onlineModeButton       = $("#btn_home_online_mode")
        this.waitingTriggers        = []
        this.online                 = true
        this.newListModal           = new NewListModal((listName)=>{
            let addToList = ()=>{
                if(this.online){
                    this.myLists.newList(listName,GroceryListC)
                }
                else{
                    this.myLists.newList(listName,GroceryList)
                }
            }
            if(this.myLists){
                addToList()
            }
            else{
                this.waitingTriggers.push(addToList)
            }
        })
        this.newItemModal           = new NewItemModal((itemName)=>{
            this.currentList.addGroceryItem(itemName)
        })
        this.installListeners()
    }

    private installListeners(){
        this.newListButton.on('click',()=>{
            this.newListModal.open()
        })
        this.newItemButton.on('click',()=>{
            this.newItemModal.open()
        })
        this.offlineModeButton.show()
        this.offlineModeButton.on('click',()=>{
            this.client.server.requestGoOffline().then((evList : UserLists)=>{
                this.online = false
                this.myLists = evList as any
                this.myLists.lists.forEach((list)=>{
                    if(list.listName == this.currentListName){
                        this.currentList = list
                    }
                })
                this.offlineModeButton.hide()
                this.onlineModeButton.show()
            })
        })
        this.onlineModeButton.on('click',()=>{
            this.client.server.requestGoOnline(this.myLists as any).then((ecList : UserListsC)=>{
                this.online = true
                this.myLists = ecList;
                (ecList.lists as any).then((lists : Array<GroceryListC>)=>{
                    lists.forEach((list  : GroceryListC)=>{
                        (list.listName as any).then((name)=>{
                            if(name == this.currentListName){
                                this.currentList = list
                            }
                        })
                    })
                })
                this.offlineModeButton.show()
                this.onlineModeButton.hide()
            })
        })
    }

    private showListInspector(list : GroceryListC,listName : string){
        this.currentList        = list
        this.currentListName    = listName
        this.listInspector.css("display", "inline-block")
        this.currentListHeader.text(listName)
        if(this.online){
            this.listListenerC(list)
        }
        else{
            this.listListenerEV(list as any)
        }
    }

    allListsListener(){
        if(this.online){
            this.allListListenerC()
        }
        else{
            this.allListListenerEV()
        }
    }

    allListListenerC(){
        (this.myLists.lists as any).then((lists : Array<FarRef<GroceryListC>>)=>{
            this.myListsColl.empty().off("*");
            lists.forEach((list : FarRef<GroceryListC>)=>{
                (list.listName as any).then((name)=>{
                    let li = $("<li>")
                    let a = $("<a class=\"waves-effect waves-light btn brown darken-1\">")
                    a.text(name)
                    li.append(a)
                    li.on('click',()=>{
                        this.showListInspector(list,name)
                    })
                    this.myListsColl.append(li)
                    if(this.currentList){
                        if(this.currentListName == name){
                            this.listListenerC(list)
                        }
                    }
                })
            })
        })
    }

    allListListenerEV(){
        this.myListsColl.empty().off("*");
        this.myLists.lists.forEach((list)=>{
            let li = $("<li>")
            let a = $("<a class=\"waves-effect waves-light btn brown darken-1\">")
            a.text(list.listName)
            li.append(a)
            li.on('click',()=>{
                this.showListInspector(list,list.listName)
            })
            this.myListsColl.append(li)
            if(this.currentList){
                if(this.currentListName == list.listName){
                    this.listListenerEV(list as any)
                }
            }
        })
    }

    listListenerC(list : GroceryListC){
        (list.items as any).then((items : Map<string,number>)=>{
            this.selectedListColl.empty().off("*");
            items.forEach((quantity : number,itemName : string)=>{
                let li = $("<li>")
                li.addClass("collection-item")
                let p = $("<p class='flow-text'>").text(itemName + " : " + quantity + "    ")
                li.append(p)
                let inc = $("<a>")
                inc.on('click',()=>{
                    list.incQuantity(itemName)
                })
                inc.addClass("waves-effect waves-light btn brown darken-1")
                let incIcon = $("<i class='material-icons'>add<i/>")
                inc.append(incIcon)
                li.append(inc)
                let dec = $("<a>")
                dec.on('click',()=>{
                    list.decQuantity(itemName)
                })
                dec.addClass("waves-effect waves-light btn red")
                let decIcon = $("<i class='material-icons'>remove<i/>")
                dec.append(decIcon)
                li.append(dec)
                let take = $("<a>")
                take.on('click',()=>{
                    (this.boughList.buyItem(list.listName,itemName) as any).then((ok)=>{
                        if(ok){
                            take.addClass("disabled")
                        }
                        else{
                            take.removeClass("teal")
                            take.addClass("red")
                        }
                    })
                })
                take.addClass("waves-effect waves-light btn teal")
                let takeIcon = $("<i class='material-icons'>shopping_cart<i/>")
                take.append(takeIcon)
                li.append(take)
                this.selectedListColl.append(li)
            })
        })
    }

    listListenerEV(list : GroceryList){
        this.selectedListColl.empty().off("*");
        list.items.forEach((quantity : number,itemName : string)=>{
            let li = $("<li>")
            li.addClass("collection-item")
            let p = $("<p class='flow-text'>").text(itemName + " : " + quantity + "    ")
            li.append(p)
            let inc = $("<a>")
            inc.on('click',()=>{
                list.incQuantity(itemName)
            })
            inc.addClass("waves-effect waves-light btn brown darken-1")
            let incIcon = $("<i class='material-icons'>add<i/>")
            inc.append(incIcon)
            li.append(inc)
            let dec = $("<a>")
            dec.on('click',()=>{
                list.decQuantity(itemName)
            })
            dec.addClass("waves-effect waves-light btn red")
            let decIcon = $("<i class='material-icons'>remove<i/>")
            dec.append(decIcon)
            li.append(dec)
            let take = $("<a>")
            take.on('click',()=>{
                (this.boughList.buyItem(list.listName,itemName) as any).then((ok)=>{
                    if(ok){
                        take.addClass("disabled")
                    }
                    else{
                        take.removeClass("teal")
                        take.addClass("red")
                    }
                })
            })
            take.addClass("waves-effect waves-light btn teal")
            let takeIcon = $("<i class='material-icons'>shopping_cart<i/>")
            take.append(takeIcon)
            li.append(take)
            this.selectedListColl.append(li)
        })
    }

    show(){
        super.show()
        this.client.server.requestMyLists().then(([lists,boughList])=>{
            this.myLists    = lists
            this.boughList  = boughList
            this.poll()
        })
    }

    poll(){
        setTimeout(()=>{
            this.allListsListener()
            this.poll()
        },1000)

    }
}