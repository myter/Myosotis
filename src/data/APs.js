var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const spiders_captain_1 = require("spiders.captain");
class UserLists extends spiders_captain_1.Eventual {
    constructor(ownerName) {
        super();
        this.owner = ownerName;
        this.lists = [];
    }
    newList(list) {
        this.lists.push(list);
    }
}
__decorate([
    spiders_captain_1.mutating
], UserLists.prototype, "newList", null);
exports.UserLists = UserLists;
class GroceryList extends spiders_captain_1.Eventual {
    constructor(name) {
        super();
        this.listName = name;
        this.items = new Map();
    }
    addGroceryItem(itemName) {
        if (this.items.has(itemName)) {
            this.incQuantity(itemName);
        }
        else {
            this.items.set(itemName, 1);
        }
    }
    remGroceryItem(itemName) {
        this.items.delete(itemName);
    }
    incQuantity(itemName) {
        let prevQuantity = this.items.get(itemName);
        this.items.set(itemName, prevQuantity + 1);
    }
    decQuantity(itemName) {
        let prevQuantity = this.items.get(itemName);
        if (prevQuantity - 1 <= 0) {
            this.remGroceryItem(itemName);
        }
        else {
            this.items.set(itemName, prevQuantity - 1);
        }
    }
}
__decorate([
    spiders_captain_1.mutating
], GroceryList.prototype, "addGroceryItem", null);
__decorate([
    spiders_captain_1.mutating
], GroceryList.prototype, "remGroceryItem", null);
__decorate([
    spiders_captain_1.mutating
], GroceryList.prototype, "incQuantity", null);
__decorate([
    spiders_captain_1.mutating
], GroceryList.prototype, "decQuantity", null);
exports.GroceryList = GroceryList;
class UserListsC extends spiders_captain_1.Consistent {
    constructor(ownerName) {
        super();
        this.owner = ownerName;
        this.lists = [];
    }
    newList(listName, listConstructor) {
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
__decorate([
    spiders_captain_1.mutating
], UserListsC.prototype, "newList", null);
exports.UserListsC = UserListsC;
class GroceryListC extends spiders_captain_1.Consistent {
    constructor(name) {
        super();
        this.listName = name;
        this.items = new Map();
    }
    addGroceryItem(itemName) {
        if (this.items.has(itemName)) {
            this.incQuantity(itemName);
        }
        else {
            this.items.set(itemName, 1);
        }
    }
    remGroceryItem(itemName) {
        this.items.delete(itemName);
    }
    incQuantity(itemName) {
        let prevQuantity = this.items.get(itemName);
        this.items.set(itemName, prevQuantity + 1);
    }
    decQuantity(itemName) {
        let prevQuantity = this.items.get(itemName);
        if (prevQuantity - 1 <= 0) {
            this.remGroceryItem(itemName);
        }
        else {
            this.items.set(itemName, prevQuantity - 1);
        }
    }
    mergeItem(itemName, quantity) {
        this.items.set(itemName, quantity);
    }
}
__decorate([
    spiders_captain_1.mutating
], GroceryListC.prototype, "addGroceryItem", null);
__decorate([
    spiders_captain_1.mutating
], GroceryListC.prototype, "remGroceryItem", null);
__decorate([
    spiders_captain_1.mutating
], GroceryListC.prototype, "incQuantity", null);
__decorate([
    spiders_captain_1.mutating
], GroceryListC.prototype, "decQuantity", null);
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