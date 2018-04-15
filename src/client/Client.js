Object.defineProperty(exports, "__esModule", { value: true });
const spiders_captain_1 = require("spiders.captain");
const Login_1 = require("./Login");
const Home_1 = require("./Home");
const ServerComm_1 = require("./ServerComm");
class MyoClient extends spiders_captain_1.CAPplication {
    constructor() {
        super();
        //this.server         = new ServerComm(this.libs.buffRemote("127.0.0.1",8000))
        this.server = new ServerComm_1.ServerComm(this.libs.setupPSClient("spitter.soft.vub.ac.be", 8000), this.libs.PubSubTag);
        this.navs = $("#nav_all");
        this.login = new Login_1.LoginScreen(this);
        this.home = new Home_1.HomeScreen(this);
        this.currentScreen = this.login;
        this.hideNavs();
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