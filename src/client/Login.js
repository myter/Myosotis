Object.defineProperty(exports, "__esModule", { value: true });
const MyoScreen_1 = require("./MyoScreen");
class LoginScreen extends MyoScreen_1.MyoScreen {
    constructor(client) {
        super(client, $("#screen_login"));
        this.loginButton = $("#btn_login_ok");
        this.newUserButton = $("#btn_login_new");
        this.userNameField = $("#inp_login_username");
        this.passwordField = $("#inp_login_password");
        this.installListeners();
    }
    getData() {
        return [this.userNameField.val(), this.passwordField.val()];
    }
    installListeners() {
        let loginPressed = () => {
            let [userName, password] = this.getData();
            this.client.server.requestLogin(userName, password).then((ok) => {
                if (ok) {
                    this.client.showNavs();
                    this.client.changeScreen();
                }
                else {
                    //TODO
                }
            });
        };
        this.loginButton.click(loginPressed.bind(this));
        this.newUserButton.click(() => {
            let [userName, password] = this.getData();
            this.client.server.requestNewUser(userName, password).then((ok) => {
                if (ok) {
                    this.client.showNavs();
                    this.client.changeScreen();
                }
                else {
                    //TODO
                }
            });
        });
        this.passwordField.keypress(function (e) {
            if (e.keyCode == 13)
                loginPressed();
        });
    }
}
exports.LoginScreen = LoginScreen;
//# sourceMappingURL=Login.js.map