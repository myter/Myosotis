Object.defineProperty(exports, "__esModule", { value: true });
const spiders_captain_1 = require("spiders.captain");
const APs_1 = require("../data/APs");
class MyoServer2 extends spiders_captain_1.CAPplication {
    constructor() {
        super();
        this.lists = new Map();
    }
    log(accountName) {
        if (this.lists.has(accountName)) {
            return [this.lists.get(accountName), false];
        }
        else {
            let list = new APs_1.UserListsC(accountName);
            this.lists.set(accountName, list);
            return [list, true];
        }
    }
}
class MyoClient2 extends spiders_captain_1.CAPActor {
    constructor(accountName, serverRef, dataAccumRef, id, totalLength) {
        super();
        this.accountName = accountName;
        this.server = serverRef;
        this.dataAccum = dataAccumRef;
        this.id = id;
        this.GroceryList = APs_1.GroceryListC;
        this.totalLength = totalLength;
        this.thisDir = __dirname;
    }
    init() {
        return this.server.log(this.accountName).then(([list, first]) => {
            this.myLists = list;
            if (first) {
                let GroceryListC = require(this.thisDir + "/../data/APs").GroceryListC;
                list.newListMUT("bench", GroceryListC);
            }
        });
    }
    performOps(amount) {
        if (this.myLists) {
            if (amount > 0) {
                this.myLists.lists.then((lists) => {
                    let tentStart = Date.now();
                    lists[0].addGroceryItemMUT(this.id + "item" + amount).then(() => {
                        let timeToLocalChange = Date.now() - tentStart;
                        this.dataAccum.localChangeTime(timeToLocalChange);
                    });
                });
                this.performOps(amount - 1);
            }
        }
        else {
            this.init().then(() => {
                this.performOps(amount);
            });
        }
    }
}
class DataAccum2 extends spiders_captain_1.CAPActor {
    constructor(totalClients, totalOps) {
        super();
        this.totalClients = totalClients;
        this.localTimes = [];
        this.totalOps = totalOps;
    }
    init() {
        this.clientsCommitted = 0;
    }
    localChangeTime(time) {
        if (this.localTimes.length == 0) {
            this.benchStart = Date.now();
        }
        this.localTimes.push(time);
        if (this.localTimes.length == this.totalOps) {
            let benchTotal = Date.now() - this.benchStart;
            this.onComp([benchTotal, this.localTimes]);
        }
    }
    onComplete() {
        return new Promise((resolve) => {
            this.onComp = resolve;
        });
    }
}
function runSimul(nrClients, opPerClient) {
    return new Promise((resolve) => {
        let app = new MyoServer2();
        let dat = app.spawnActor(DataAccum2, [nrClients, (nrClients * opPerClient)]);
        dat.onComplete().then(([totalTime, localTimes]) => {
            let avg = 0;
            localTimes.forEach((time) => {
                avg += time;
            });
            avg = avg / localTimes.length;
            app.kill();
            resolve([totalTime, avg]);
        });
        let clients = [];
        for (var i = 0; i < nrClients; i++) {
            clients.push(app.spawnActor(MyoClient2, ["test", app, dat, i, (nrClients * opPerClient)]));
        }
        setTimeout(() => {
            clients.forEach((client) => {
                client.performOps(opPerClient);
            });
        }, 10000);
    });
}
exports.runSimul = runSimul;
//# sourceMappingURL=MyoSimul2.js.map