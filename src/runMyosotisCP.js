Object.defineProperty(exports, "__esModule", { value: true });
const Server2_1 = require("./server/Server2");
let config = require("./ExampleAppConfig.json");
new Server2_1.Server2(config.ServerHTMLPort, "./client/client.html", "./client/Client.js");
//# sourceMappingURL=runMyosotisCP.js.map