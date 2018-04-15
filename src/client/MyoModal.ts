export class MyoModal{
    myDiv

    constructor(myDiv : JQuery<HTMLElement>){
        this.myDiv = myDiv;
        (myDiv as any).modal()
    }

    open(){
        this.myDiv.modal('open')()
    }

    close(){
        this.myDiv.modal('close')()
    }
}