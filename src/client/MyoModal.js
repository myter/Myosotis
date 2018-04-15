Object.defineProperty(exports, "__esModule", { value: true });
class MyoModal {
    constructor(myDiv) {
        this.myDiv = myDiv;
        myDiv.modal();
    }
    open() {
        this.myDiv.modal('open')();
    }
    close() {
        this.myDiv.modal('close')();
    }
}
exports.MyoModal = MyoModal;
//# sourceMappingURL=MyoModal.js.map