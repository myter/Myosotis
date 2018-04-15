Object.defineProperty(exports, "__esModule", { value: true });
class MyoScreen {
    constructor(client, myDiv, myNavDiv) {
        this.client = client;
        this.myDiv = myDiv;
        this.myNavDiv = myNavDiv;
    }
    toggleNavActive() {
        if (this.myNavDiv) {
            this.myNavDiv.toggleClass("active");
        }
    }
    show() {
        this.myDiv.show();
        this.toggleNavActive();
    }
    hide() {
        this.myDiv.hide();
        this.toggleNavActive();
    }
}
exports.MyoScreen = MyoScreen;
//# sourceMappingURL=MyoScreen.js.map