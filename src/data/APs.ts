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

export class UserListsC extends Consistent{
    owner : string
    lists : Array<GroceryListC>

    constructor(ownerName : string){
        super()
        this.owner = ownerName
        this.lists = []
    }

    newListMUT(listName,listConstructor){
        this.lists.push(new listConstructor(listName))
    }

    merge(otherList : UserListsC){
        (otherList.lists as any).then((lists : Array<GroceryListC>)=>{
            lists.forEach((list : GroceryListC)=>{
                (list.listName as any).then((listName)=>{
                    let newList = true
                    let existing : GroceryListC
                    let promises = this.lists.map((existingList : GroceryListC)=>{
                        return (existingList.listName as any).then((existingName)=>{
                            if(existingName == listName){
                                newList = false
                                existing = existingList
                            }
                        })
                    })
                    Promise.all(promises).then(()=>{
                        if(newList){
                            this.lists.push(list)
                        }
                        else{
                            /*(existing.items as any).then((items : Map<string,number>)=>{
                                items.forEach((quantity : number,itemName : string)=>{
                                    list.mergeItem(itemName,quantity)
                                })
                            })*/
                            (list.items as any).then((items : Map<string,number>)=>{
                                items.forEach((quantity : number,itemName : string)=>{
                                    existing.mergeItem(itemName,quantity)
                                })
                            })
                        }
                    })
                })
            })
        })
    }
}

export class GroceryListC extends Consistent{
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

    mergeItem(itemName,quantity){
        this.items.set(itemName,quantity)
    }
}


export class BoughtList extends Consistent{
    bought : Map<string,Array<string>>

    constructor(){
        super()
        this.bought = new Map()
    }

    buyItem(listName : string,itemName : string){
        if(this.bought.has(listName)){
            if((this.bought.get(listName) as any).includes(itemName)){
                return false
            }
            else{
                this.bought.get(listName).push(itemName)
                return true
            }
        }
        else{
            this.bought.set(listName,[itemName])
            return true
        }
    }
}