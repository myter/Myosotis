Object.defineProperty(exports, "__esModule", { value: true });
const MyoModal_1 = require("./MyoModal");
class NewListModal extends MyoModal_1.MyoModal {
    constructor(createTrigger) {
        super($("#mod_home_new_list"));
        this.listNameInp = $("#inp_new_list_name");
        this.createButton = $("#btn_new_list_create");
        this.cancelButton = $("#btn_new_list_cancel");
        this.createTrigger = createTrigger;
        this.installListeners();
    }
    installListeners() {
        this.createButton.click(() => {
            this.createTrigger(this.listNameInp.val());
            this.resetAndClose();
        });
        this.cancelButton.click(() => {
            this.resetAndClose();
        });
    }
    resetAndClose() {
        this.listNameInp.val('');
        this.close();
    }
}
exports.NewListModal = NewListModal;
//# sourceMappingURL=NewListModal.js.map