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
        //this.server         = new ServerComm(this.libs.setupPSClient("spitter.soft.vub.ac.be",8000),this.libs.PubSubTag)
        this.server         = new ServerComm(this.libs.setupPSClient(),this.libs.PubSubTag)
        this.navs           = $("#nav_all")
        this.login          = new LoginScreen(this)
        this.currentScreen  = this.login
        this.hideNavs()
    }

    setHomeScreen(homeClass){
        this.home = new homeClass(this)
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