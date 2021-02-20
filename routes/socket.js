const {Subject}=require('rxjs')
const ws=require('ws')
//port需要暴露出来给下面的router使用
let port=3001
let commonData='系统欢迎你进入聊天室'
let onlineNumber=0
const sendSubject=new Subject()
const connectSubject=new Subject()
connectSubject.subscribe(val=>{
    const io=new ws.Server({
        port:port,
    })
    console.log(io.on);
    
    io.on("connection", (wsObj)=>{
        onlineNumber++
        const date=new Date().toLocaleString('chinese',{hour12:false})
        sendSubject.subscribe(data=>{
            wsObj.send(JSON.stringify(data))
        })
        sendSubject.next({
            text:commonData,
            onlineNumber,
            date,
        })
        wsObj.on('message',(data)=>{
            commonData=data
            sendSubject.next({
                text:data,
                onlineNumber,
                date,
            })
        })
        wsObj.on('close',()=>{
            onlineNumber--
            sendSubject.next({
                text:commonData,
                onlineNumber,
            })
        })
        if(port>65000){
            port=3001
        }else{
            port++
        }
        connectSubject.next(port)
    })
})
connectSubject.next(3001)

//路由相关
const express = require('express')
const router = express.Router()
router.get('/', function(req, res, next) {
    res.send({
        port:port
    })
});
module.exports = router
