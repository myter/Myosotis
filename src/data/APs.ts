import {Consistent, Eventual as Available} from "spiders.captain"

export class UserLists extends Available{
    owner : string
    lists : Array<GroceryList>

    constructor(ownerName : string){
        super()
        this.owner = ownerName
        this.lists = []
    }

    newListMUT(list : GroceryList){
        this.lists.push(list)
    }
}

export class GroceryList extends Available{
    listName    : string
    items       : Map<string,number>

    constructor(name : string){
        super()
        this.listName   = name
        this.items      = new Map()
    }

    addGroceryItemMUT(itemName : string){
        if(this.items.has(itemName)){
            this.incQuantityMUT(itemName)
        }
        else{
            this.items.set(itemName,1)
        }
    }

    remGroceryItemMUT(itemName : string){
        this.items.delete(itemName)
    }

    incQuantityMUT(itemName){
        let prevQuantity = this.items.get(itemName)
        this.items.set(itemName,prevQuantity+1)
    }

    decQuantityMUT(itemName){
        let prevQuantity = this.items.get(itemName)
        if(prevQuantity -1 <= 0){
            this.remGroceryItemMUT(itemName)
        }
        else{
            this.items.set(itemName,prevQuantity-1)
        }
    }
}


export class BoughtList extends Consistent{
    bought : Map<string,Array<string>>

    constructor(){
        super()
        this.bought = new Map()
    }

    buyItem(listName : string,itemName : string){
        return (this.bought as any).then((bought)=>{
            if(bought.has(listName)){
                if((bought.get(listName) as any).includes(itemName)){
                    return false
                }
                else{
                    bought.get(listName).push(itemName)
                    return true
                }
            }
            else{
                bought.set(listName,[itemName])
                return true
            }
        })
    }
}