import {Server} from "./server/Server";

let config = require("./ExampleAppConfig.json")
new Server(config.ServerHTMLPort,"./client/client.html","./client/Client.js")