import {runSimul} from "./MyoSimul2";
var csvWriter = require('csv-write-stream')
var fs = require('fs')
var writer = csvWriter()
var Stats = require('fast-stats').Stats;

function loop(clients,opPerClient,times,totalStore,localStore){
    console.log("Running " + clients + " : " + times)
    if(times > 0){
        return runSimul(clients,opPerClient).then(([total,local])=>{
            totalStore.push(total)
            localStore.push(local)
            return loop(clients,opPerClient,times-1,totalStore,localStore)
        })
    }
    else{
        return new Promise((resolve)=>{
            resolve()
        })
    }
}

let total = []
let local = []

var samples = 30
var perClient = 10

loop(50,perClient,samples,total,local).then(()=>{
    write(total,local)
})



function write(totalStore,localStore){
    let sT = new Stats()
    let sL = new Stats()
    sT.push(totalStore)
    sL.push(localStore)
    var writer = csvWriter({sendHeaders: false})
    writer.pipe(fs.createWriteStream('CPresults.csv',{flags: 'a'}))
    writer.write({total: sT.median(),totalError: sT.moe(), local: sL.median(),localError : sL.moe()})
    writer.end()
}