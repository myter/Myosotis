Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("./server/Server");
let config = require("./ExampleAppConfig.json");
new Server_1.Server(config.ServerHTMLPort, "./client/client.html", "./client/Client.js");
//# sourceMappingURL=runMyosotisAP.js.map