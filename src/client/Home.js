Object.defineProperty(exports, "__esModule", { value: true });
const MyoScreen_1 = require("./MyoScreen");
const NewListModal_1 = require("./NewListModal");
const APs_1 = require("../data/APs");
const NewItemModal_1 = require("./NewItemModal");
class HomeScreen extends MyoScreen_1.MyoScreen {
    constructor(client) {
        super(client, $("#screen_home"), $("#nav_home"));
        this.newListButton = $("#btn_home_new_list");
        this.newItemButton = $("#btn_home_new_item");
        this.myListsColl = $("#nav_all");
        this.selectedListColl = $("#coll_home_selected_list");
        this.listInspector = $("#list_inspector");
        this.currentListHeader = $("#list_content_header");
        this.waitingTriggers = [];
        this.newListModal = new NewListModal_1.NewListModal((listName) => {
            let addToList = () => {
                let newList = new APs_1.GroceryList(listName);
                this.myLists.newList(newList);
            };
            if (this.myLists) {
                addToList();
            }
            else {
                this.waitingTriggers.push(addToList);
            }
        });
        this.newItemModal = new NewItemModal_1.NewItemModal((itemName) => {
            this.currentList.addGroceryItem(itemName);
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
    }
    showListInspector(list) {
        this.currentList = list;
        this.listInspector.css("display", "inline-block");
        this.currentListHeader.text(list.listName);
        this.listListener(list);
    }
    allListsListener() {
        console.log("Change in state");
        this.myListsColl.empty().off("*");
        this.myLists.lists.forEach((list) => {
            let li = $("<li>");
            let a = $("<a class=\"waves-effect waves-light btn brown darken-1\">");
            a.text(list.listName);
            li.append(a);
            li.on('click', () => {
                this.showListInspector(list);
            });
            this.myListsColl.append(li);
            if (this.currentList) {
                if (this.currentList.listName == list.listName) {
                    this.listListener(list);
                }
            }
        });
    }
    listListener(list) {
        this.selectedListColl.empty().off("*");
        if (this.currentList) {
            if (this.currentList.listName == list.listName) {
                list.items.forEach((quantity, itemName) => {
                    let li = $("<li>");
                    li.addClass("collection-item");
                    let p = $("<p class='flow-text'>").text(itemName + " : " + quantity + "    ");
                    li.append(p);
                    let inc = $("<a>");
                    inc.on('click', () => {
                        list.incQuantity(itemName);
                    });
                    inc.addClass("waves-effect waves-light btn brown darken-1");
                    let incIcon = $("<i class='material-icons'>add<i/>");
                    inc.append(incIcon);
                    li.append(inc);
                    let dec = $("<a>");
                    dec.on('click', () => {
                        list.decQuantity(itemName);
                    });
                    dec.addClass("waves-effect waves-light btn red");
                    let decIcon = $("<i class='material-icons'>remove<i/>");
                    dec.append(decIcon);
                    li.append(dec);
                    /*let rem = $("<a>")
                    rem.on('click',()=>{
                        list.remGroceryItemMUT(item)
                    })
                    rem.addClass("waves-effect waves-light btn red")
                    let remIcon = $("<i class='material-icons'>delete<i/>")
                    rem.append(remIcon)
                    li.append(rem)*/
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
        }
    }
    show() {
        super.show();
        this.client.server.requestMyLists().then(([lists, boughList]) => {
            lists.onTentative(this.allListsListener.bind(this));
            lists.onCommit(this.allListsListener.bind(this));
            this.myLists = lists;
            this.boughList = boughList;
            this.allListsListener();
        });
    }
}
exports.HomeScreen = HomeScreen;
//# sourceMappingURL=Home.js.map