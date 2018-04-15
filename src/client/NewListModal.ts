import {MyoModal} from "./MyoModal";

export class NewListModal extends MyoModal{
    listNameInp     : JQuery<HTMLElement>
    createButton    : JQuery<HTMLElement>
    cancelButton    : JQuery<HTMLElement>
    createTrigger   : (string)=>any

    constructor(createTrigger : (string)=>any){
        super($("#mod_home_new_list"))
        this.listNameInp    = $("#inp_new_list_name")
        this.createButton   = $("#btn_new_list_create")
        this.cancelButton   = $("#btn_new_list_cancel")
        this.createTrigger  = createTrigger
        this.installListeners()
    }

    installListeners(){
        this.createButton.click(()=>{
            this.createTrigger(this.listNameInp.val())
            this.resetAndClose()
        })
        this.cancelButton.click(()=>{
            this.resetAndClose()
        })
    }

    resetAndClose(){
        this.listNameInp.val('')
        this.close()
    }
}