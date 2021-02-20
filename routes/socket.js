const {Subject}=require('rxjs')
const ws=require('ws')
//初始化在线人数和端口
let onlineNumber=0
const firstPort=3001

const sendSubject=new Subject()
const connectSubject=new Subject()
//后端监听端口以连接客户端发来的websocket请求
connectSubject.subscribe(port=>{
    const io=new ws.Server({
        port:port,
    })
    io.on("connection", (wsObj)=>{
        onlineNumber++
        const date=new Date().toLocaleString('chinese',{hour12:false})
        //客户端第一次进来
        wsObj.send(JSON.stringify({
            text:'欢迎你进入聊天室',
            onlineNumber,
            date,
            port:firstPort,
        }))
 
        sendSubject.subscribe(data=>{
            wsObj.send(JSON.stringify(data))
        })
        //在线人数的改变
        sendSubject.next({onlineNumber})

        wsObj.on('message',(text)=>{
            //消息的改变
            sendSubject.next({
                text,
                onlineNumber,
                date,
                port,
            })
        })
        wsObj.on('close',()=>{
            onlineNumber--
            sendSubject.next({
                onlineNumber,
            });
        })
    })
})
//路由相关
const express = require('express')
const router = express.Router()
let port=firstPort
router.get('/', function(req, res, next) {
    connectSubject.next(port);
    res.send({
        port:port
    })
    if(port>65000){
        port=firstPort
    }else{
        port++
    }
})
module.exports = router
