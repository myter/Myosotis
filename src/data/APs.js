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
class BoughtList extends spiders_captain_1.Consistent {
    constructor() {
        super();
        this.bought = new Map();
    }
    buyItem(listName, itemName) {
        return this.bought.then((bought) => {
            if (bought.has(listName)) {
                if (bought.get(listName).includes(itemName)) {
                    return false;
                }
                else {
                    bought.get(listName).push(itemName);
                    return true;
                }
            }
            else {
                bought.set(listName, [itemName]);
                return true;
            }
        });
    }
}
exports.BoughtList = BoughtList;
//# sourceMappingURL=APs.js.map