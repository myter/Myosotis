import {CAPplication} from "spiders.captain"
import {LoginScreen} from "./Login";
import {MyoScreen} from "./MyoScreen";
import {HomeScreen} from "./Home";
import {ServerComm} from "./ServerComm";

export class MyoClient extends CAPplication{
    server          : ServerComm
    navs            : JQuery<HTMLElement>
    login           : LoginScreen
    home            : HomeScreen
    currentScreen   : MyoScreen

    constructor(){
        super()
        //this.server         = new ServerComm(this.libs.buffRemote("127.0.0.1",8000))
        this.server         = new ServerComm(this.libs.setupPSClient("localhost",8000),this.libs.PubSubTag,this.libs.buffRemote("127.0.0.1",8000))
        this.navs           = $("#nav_all")
        this.login          = new LoginScreen(this)
        this.home           = new HomeScreen(this)
        this.currentScreen  = this.login
        this.hideNavs()
    }

    changeScreen(toScreen?){
        if(toScreen){
            this.currentScreen.hide()
            toScreen.show()
            this.currentScreen = toScreen
        }
        else{
            this.currentScreen.hide()
            this.home.show()
            this.currentScreen = this.home
        }
    }

    hideNavs(){
        this.navs.hide()
    }

    showNavs(){
        this.navs.show()
    }
}
new MyoClient()