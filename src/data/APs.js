Object.defineProperty(exports, "__esModule", { value: true });
const spiders_captain_1 = require("spiders.captain");
class UserLists extends spiders_captain_1.Eventual {
    constructor(ownerName) {
        super();
        this.owner = ownerName;
        this.lists = [];
    }
    newListMUT(list) {
        this.lists.push(list);
    }
}
exports.UserLists = UserLists;
class GroceryList extends spiders_captain_1.Eventual {
    constructor(name) {
        super();
        this.listName = name;
        this.items = new Map();
    }
    addGroceryItemMUT(itemName) {
        if (this.items.has(itemName)) {
            this.incQuantityMUT(itemName);
        }
        else {
            this.items.set(itemName, 1);
        }
    }
    remGroceryItemMUT(itemName) {
        this.items.delete(itemName);
    }
    incQuantityMUT(itemName) {
        let prevQuantity = this.items.get(itemName);
        this.items.set(itemName, prevQuantity + 1);
    }
    decQuantityMUT(itemName) {
        let prevQuantity = this.items.get(itemName);
        if (prevQuantity - 1 <= 0) {
            this.remGroceryItemMUT(itemName);
        }
        else {
            this.items.set(itemName, prevQuantity - 1);
        }
    }
}
exports.GroceryList = GroceryList;
class UserListsC extends spiders_captain_1.Consistent {
    constructor(ownerName) {
        super();
        this.owner = ownerName;
        this.lists = [];
    }
    newListMUT(listName, listConstructor) {
        this.lists.push(new listConstructor(listName));
    }
    merge(otherList) {
        otherList.lists.then((lists) => {
            lists.forEach((list) => {
                list.listName.then((listName) => {
                    let newList = true;
                    let existing;
                    let promises = this.lists.map((existingList) => {
                        return existingList.listName.then((existingName) => {
                            if (existingName == listName) {
                                newList = false;
                                existing = existingList;
                            }
                        });
                    });
                    Promise.all(promises).then(() => {
                        if (newList) {
                            this.lists.push(list);
                        }
                        else {
                            /*(existing.items as any).then((items : Map<string,number>)=>{
                                items.forEach((quantity : number,itemName : string)=>{
                                    list.mergeItem(itemName,quantity)
                                })
                            })*/
                            list.items.then((items) => {
                                items.forEach((quantity, itemName) => {
                                    existing.mergeItem(itemName, quantity);
                                });
                            });
                        }
                    });
                });
            });
        });
    }
}
exports.UserListsC = UserListsC;
class GroceryListC extends spiders_captain_1.Consistent {
    constructor(name) {
        super();
        this.listName = name;
        this.items = new Map();
    }
    addGroceryItemMUT(itemName) {
        if (this.items.has(itemName)) {
            this.incQuantityMUT(itemName);
        }
        else {
            this.items.set(itemName, 1);
        }
    }
    remGroceryItemMUT(itemName) {
        this.items.delete(itemName);
    }
    incQuantityMUT(itemName) {
        let prevQuantity = this.items.get(itemName);
        this.items.set(itemName, prevQuantity + 1);
    }
    decQuantityMUT(itemName) {
        let prevQuantity = this.items.get(itemName);
        if (prevQuantity - 1 <= 0) {
            this.remGroceryItemMUT(itemName);
        }
        else {
            this.items.set(itemName, prevQuantity - 1);
        }
    }
    mergeItem(itemName, quantity) {
        this.items.set(itemName, quantity);
    }
}
exports.GroceryListC = GroceryListC;
class BoughtList extends spiders_captain_1.Consistent {
    constructor() {
        super();
        this.bought = new Map();
    }
    buyItem(listName, itemName) {
        if (this.bought.has(listName)) {
            if (this.bought.get(listName).includes(itemName)) {
                return false;
            }
            else {
                this.bought.get(listName).push(itemName);
                return true;
            }
        }
        else {
            this.bought.set(listName, [itemName]);
            return true;
        }
    }
}
exports.BoughtList = BoughtList;
//# sourceMappingURL=APs.js.map