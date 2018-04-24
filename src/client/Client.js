Object.defineProperty(exports, "__esModule", { value: true });
const spiders_captain_1 = require("spiders.captain");
const Login_1 = require("./Login");
const ServerComm_1 = require("./ServerComm");
let conf = require("../ExampleAppConfig.json");
class MyoClient extends spiders_captain_1.CAPplication {
    constructor() {
        super();
        this.server = new ServerComm_1.ServerComm(this.libs.setupPSClient(conf.ServerAddress, conf.ServerSocketPort), this.libs.PubSubTag);
        this.navs = $("#nav_all");
        this.login = new Login_1.LoginScreen(this);
        this.currentScreen = this.login;
        this.hideNavs();
    }
    setHomeScreen(homeClass) {
        this.home = new homeClass(this);
    }
    changeScreen(toScreen) {
        if (toScreen) {
            this.currentScreen.hide();
            toScreen.show();
            this.currentScreen = toScreen;
        }
        else {
            this.currentScreen.hide();
            this.home.show();
            this.currentScreen = this.home;
        }
    }
    hideNavs() {
        this.navs.hide();
    }
    showNavs() {
        this.navs.show();
    }
}
exports.MyoClient = MyoClient;
new MyoClient();
//# sourceMappingURL=Client.js.map