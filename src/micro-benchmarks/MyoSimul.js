Object.defineProperty(exports, "__esModule", { value: true });
const spiders_captain_1 = require("spiders.captain");
const APs_1 = require("../data/APs");
class MyoServer extends spiders_captain_1.CAPplication {
    constructor() {
        super();
        this.lists = new Map();
        this.logged = 0;
    }
    log(accountName) {
        this.logged++;
        if (this.lists.has(accountName)) {
            return [this.lists.get(accountName), false];
        }
        else {
            let list = new APs_1.UserLists(accountName);
            this.lists.set(accountName, list);
            return [list, true];
        }
    }
}
class MyoClient extends spiders_captain_1.CAPActor {
    constructor(accountName, serverRef, dataAccumRef, id, totalLength) {
        super();
        this.accountName = accountName;
        this.server = serverRef;
        this.dataAccum = dataAccumRef;
        this.id = id;
        this.GroceryList = APs_1.GroceryList;
        this.totalLength = totalLength;
    }
    init() {
        return this.server.log(this.accountName).then(([list, first]) => {
            this.myLists = list;
            if (first) {
                list.newListMUT(new this.GroceryList("bench"));
            }
            list.onCommit(() => {
                if (this.myLists.lists[0].items.size == this.totalLength) {
                    this.dataAccum.clientConsistent();
                }
            });
            list.onTentative(() => {
                let timeToLocalChange = Date.now() - this.tentStart;
                this.dataAccum.localChangeTime(timeToLocalChange);
            });
        });
    }
    performOps(amount) {
        if (this.myLists) {
            for (var i = 0; i < amount; i++) {
                this.tentStart = Date.now();
                this.myLists.lists[0].addGroceryItemMUT(this.id + "item" + i);
            }
        }
        else {
            this.init().then(() => {
                this.performOps(amount);
            });
        }
    }
}
class DataAccum extends spiders_captain_1.CAPActor {
    constructor(totalClients) {
        super();
        this.totalClients = totalClients;
        this.localTimes = [];
    }
    init() {
        this.clientsCommitted = 0;
    }
    clientConsistent() {
        this.clientsCommitted++;
        if (this.clientsCommitted == this.totalClients) {
            let benchTotal = Date.now() - this.benchStart;
            this.onComp([benchTotal, this.localTimes]);
        }
    }
    localChangeTime(time) {
        if (this.localTimes.length == 0) {
            this.benchStart = Date.now();
        }
        this.localTimes.push(time);
    }
    onComplete() {
        return new Promise((resolve) => {
            this.onComp = resolve;
        });
    }
}
function runSimul(nrClients, opPerClient) {
    return new Promise((resolve) => {
        let app = new MyoServer();
        let dat = app.spawnActor(DataAccum, [nrClients]);
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
            clients.push(app.spawnActor(MyoClient, ["test", app, dat, i, (nrClients * opPerClient)]));
        }
        setTimeout(() => {
            clients.forEach((client) => {
                client.performOps(opPerClient);
            });
        }, 10000);
    });
}
exports.runSimul = runSimul;
//# sourceMappingURL=MyoSimul.js.map