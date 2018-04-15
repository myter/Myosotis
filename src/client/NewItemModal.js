Object.defineProperty(exports, "__esModule", { value: true });
const MyoModal_1 = require("./MyoModal");
class NewItemModal extends MyoModal_1.MyoModal {
    constructor(createTrigger) {
        super($("#mod_home_new_item"));
        this.itemNameInp = $("#inp_new_item_name");
        this.createButton = $("#btn_new_item_create");
        this.cancelButton = $("#btn_new_item_cancel");
        this.createTrigger = createTrigger;
        this.installListeners();
    }
    installListeners() {
        this.createButton.click(() => {
            this.createTrigger(this.itemNameInp.val());
            this.resetAndClose();
        });
        this.cancelButton.click(() => {
            this.resetAndClose();
        });
    }
    resetAndClose() {
        this.itemNameInp.val('');
        this.close();
    }
}
exports.NewItemModal = NewItemModal;
//# sourceMappingURL=NewItemModal.js.map