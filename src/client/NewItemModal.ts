import {MyoModal} from "./MyoModal";

export class NewItemModal extends MyoModal{
    itemNameInp     : JQuery<HTMLElement>
    createButton    : JQuery<HTMLElement>
    cancelButton    : JQuery<HTMLElement>
    createTrigger   : (string)=>any

    constructor(createTrigger : (string)=>any){
        super($("#mod_home_new_item"))
        this.itemNameInp    = $("#inp_new_item_name")
        this.createButton   = $("#btn_new_item_create")
        this.cancelButton   = $("#btn_new_item_cancel")
        this.createTrigger  = createTrigger
        this.installListeners()
    }

    installListeners(){
        this.createButton.click(()=>{
            this.createTrigger(this.itemNameInp.val())
            this.resetAndClose()
        })
        this.cancelButton.click(()=>{
            this.resetAndClose()
        })
    }

    resetAndClose(){
        this.itemNameInp.val('')
        this.close()
    }
}