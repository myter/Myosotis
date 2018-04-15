import {MyoClient} from "./Client";

export class MyoScreen{
    myDiv       : JQuery<HTMLElement>
    client      : MyoClient
    myNavDiv    : JQuery<HTMLElement>

    constructor(client : MyoClient,myDiv : JQuery<HTMLElement>,myNavDiv? : JQuery<HTMLElement>){
        this.client     = client
        this.myDiv      = myDiv
        this.myNavDiv   = myNavDiv
    }

    toggleNavActive(){
        if(this.myNavDiv){
            this.myNavDiv.toggleClass("active")
        }
    }

    show(){
        this.myDiv.show()
        this.toggleNavActive()
    }

    hide(){
        this.myDiv.hide()
        this.toggleNavActive()
    }
}