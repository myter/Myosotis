Object.defineProperty(exports, "__esModule", { value: true });
const MyoScreen_1 = require("./MyoScreen");
const NewItemModal_1 = require("./NewItemModal");
const APs_1 = require("../data/APs");
const NewListModal_1 = require("./NewListModal");
class HomeScreen2 extends MyoScreen_1.MyoScreen {
    constructor(client) {
        super(client, $("#screen_home"), $("#nav_home"));
        this.newListButton = $("#btn_home_new_list");
        this.newItemButton = $("#btn_home_new_item");
        this.myListsColl = $("#nav_all");
        this.selectedListColl = $("#coll_home_selected_list");
        this.listInspector = $("#list_inspector");
        this.currentListHeader = $("#list_content_header");
        this.offlineModeButton = $("#btn_home_offline_mode");
        this.onlineModeButton = $("#btn_home_online_mode");
        this.waitingTriggers = [];
        this.online = true;
        this.newListModal = new NewListModal_1.NewListModal((listName) => {
            let addToList = () => {
                if (this.online) {
                    this.myLists.newListMUT(listName, APs_1.GroceryListC);
                }
                else {
                    this.myLists.newListMUT(listName, APs_1.GroceryList);
                }
            };
            if (this.myLists) {
                addToList();
            }
            else {
                this.waitingTriggers.push(addToList);
            }
        });
        this.newItemModal = new NewItemModal_1.NewItemModal((itemName) => {
            this.currentList.addGroceryItemMUT(itemName);
        });
        this.installListeners();
    }
    installListeners() {
        this.newListButton.on('click', () => {
            this.newListModal.open();
        });
        this.newItemButton.on('click', () => {
            this.newItemModal.open();
        });
        this.offlineModeButton.show();
        this.offlineModeButton.on('click', () => {
            this.client.server.requestGoOffline().then((evList) => {
                this.online = false;
                this.myLists = evList;
                this.myLists.lists.forEach((list) => {
                    if (list.listName == this.currentListName) {
                        this.currentList = list;
                    }
                });
                this.offlineModeButton.hide();
                this.onlineModeButton.show();
            });
        });
        this.onlineModeButton.on('click', () => {
            this.client.server.requestGoOnline(this.myLists).then((ecList) => {
                this.online = true;
                this.myLists = ecList;
                ecList.lists.then((lists) => {
                    lists.forEach((list) => {
                        list.listName.then((name) => {
                            if (name == this.currentListName) {
                                this.currentList = list;
                            }
                        });
                    });
                });
                this.offlineModeButton.show();
                this.onlineModeButton.hide();
            });
        });
    }
    showListInspector(list, listName) {
        this.currentList = list;
        this.currentListName = listName;
        this.listInspector.css("display", "inline-block");
        this.currentListHeader.text(listName);
        if (this.online) {
            this.listListenerC(list);
        }
        else {
            this.listListenerEV(list);
        }
    }
    allListsListener() {
        if (this.online) {
            this.allListListenerC();
        }
        else {
            this.allListListenerEV();
        }
    }
    allListListenerC() {
        this.myLists.lists.then((lists) => {
            this.myListsColl.empty().off("*");
            lists.forEach((list) => {
                list.listName.then((name) => {
                    let li = $("<li>");
                    let a = $("<a class=\"waves-effect waves-light btn brown darken-1\">");
                    a.text(name);
                    li.append(a);
                    li.on('click', () => {
                        this.showListInspector(list, name);
                    });
                    this.myListsColl.append(li);
                    if (this.currentList) {
                        if (this.currentListName == name) {
                            this.listListenerC(list);
                        }
                    }
                });
            });
        });
    }
    allListListenerEV() {
        this.myListsColl.empty().off("*");
        this.myLists.lists.forEach((list) => {
            let li = $("<li>");
            let a = $("<a class=\"waves-effect waves-light btn brown darken-1\">");
            a.text(list.listName);
            li.append(a);
            li.on('click', () => {
                this.showListInspector(list, list.listName);
            });
            this.myListsColl.append(li);
            if (this.currentList) {
                if (this.currentListName == list.listName) {
                    this.listListenerEV(list);
                }
            }
        });
    }
    listListenerC(list) {
        list.items.then((items) => {
            this.selectedListColl.empty().off("*");
            items.forEach((quantity, itemName) => {
                let li = $("<li>");
                li.addClass("collection-item");
                let p = $("<p class='flow-text'>").text(itemName + " : " + quantity + "    ");
                li.append(p);
                let inc = $("<a>");
                inc.on('click', () => {
                    list.incQuantityMUT(itemName);
                });
                inc.addClass("waves-effect waves-light btn brown darken-1");
                let incIcon = $("<i class='material-icons'>add<i/>");
                inc.append(incIcon);
                li.append(inc);
                let dec = $("<a>");
                dec.on('click', () => {
                    list.decQuantityMUT(itemName);
                });
                dec.addClass("waves-effect waves-light btn red");
                let decIcon = $("<i class='material-icons'>remove<i/>");
                dec.append(decIcon);
                li.append(dec);
                let take = $("<a>");
                take.on('click', () => {
                    this.boughList.buyItem(list.listName, itemName).then((ok) => {
                        if (ok) {
                            take.addClass("disabled");
                        }
                        else {
                            take.removeClass("teal");
                            take.addClass("red");
                        }
                    });
                });
                take.addClass("waves-effect waves-light btn teal");
                let takeIcon = $("<i class='material-icons'>shopping_cart<i/>");
                take.append(takeIcon);
                li.append(take);
                this.selectedListColl.append(li);
            });
        });
    }
    listListenerEV(list) {
        this.selectedListColl.empty().off("*");
        list.items.forEach((quantity, itemName) => {
            let li = $("<li>");
            li.addClass("collection-item");
            let p = $("<p class='flow-text'>").text(itemName + " : " + quantity + "    ");
            li.append(p);
            let inc = $("<a>");
            inc.on('click', () => {
                list.incQuantityMUT(itemName);
            });
            inc.addClass("waves-effect waves-light btn brown darken-1");
            let incIcon = $("<i class='material-icons'>add<i/>");
            inc.append(incIcon);
            li.append(inc);
            let dec = $("<a>");
            dec.on('click', () => {
                list.decQuantityMUT(itemName);
            });
            dec.addClass("waves-effect waves-light btn red");
            let decIcon = $("<i class='material-icons'>remove<i/>");
            dec.append(decIcon);
            li.append(dec);
            let take = $("<a>");
            take.on('click', () => {
                this.boughList.buyItem(list.listName, itemName).then((ok) => {
                    if (ok) {
                        take.addClass("disabled");
                    }
                    else {
                        take.removeClass("teal");
                        take.addClass("red");
                    }
                });
            });
            take.addClass("waves-effect waves-light btn teal");
            let takeIcon = $("<i class='material-icons'>shopping_cart<i/>");
            take.append(takeIcon);
            li.append(take);
            this.selectedListColl.append(li);
        });
    }
    show() {
        super.show();
        this.client.server.requestMyLists().then(([lists, boughList]) => {
            this.myLists = lists;
            this.boughList = boughList;
            this.poll();
        });
    }
    poll() {
        setTimeout(() => {
            this.allListsListener();
            this.poll();
        }, 1000);
    }
}
exports.HomeScreen2 = HomeScreen2;
//# sourceMappingURL=Home2.js.map