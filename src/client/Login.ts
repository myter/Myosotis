import {MyoClient} from "./Client";
import {MyoScreen} from "./MyoScreen";

export class LoginScreen extends MyoScreen{
    loginButton     : JQuery<HTMLElement>
    newUserButton   : JQuery<HTMLElement>
    userNameField   : JQuery<HTMLElement>
    passwordField   : JQuery<HTMLElement>

    constructor(client : MyoClient){
        super(client,$("#screen_login"))
        this.loginButton    = $("#btn_login_ok")
        this.newUserButton  = $("#btn_login_new")
        this.userNameField  = $("#inp_login_username")
        this.passwordField  = $("#inp_login_password")
        this.installListeners()
    }

    private getData() : Array<string>{
        return [this.userNameField.val() as string,this.passwordField.val() as string]
    }

    installListeners(){
        let loginPressed = ()=>{
            let [userName,password] = this.getData()
            this.client.server.requestLogin(userName,password).then((ok)=>{
                if(ok){
                    this.client.showNavs()
                    this.client.changeScreen()
                }
                else{
                    //TODO
                }
            })
        }
        this.loginButton.click(loginPressed.bind(this))
        this.newUserButton.click(()=>{
            let [userName,password] = this.getData()
            this.client.server.requestNewUser(userName,password).then((ok)=>{
                if(ok){
                    this.client.showNavs()
                    this.client.changeScreen()
                }
                else{
                    //TODO
                }
            })
        })
        this.passwordField.keypress(function(e){
            if(e.keyCode==13) loginPressed()
        });
    }

}