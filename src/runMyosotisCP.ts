import {Server2} from "./server/Server2";

let config = require("./ExampleAppConfig.json")
new Server2(config.ServerHTMLPort,"./client/client.html","./client/Client.js")