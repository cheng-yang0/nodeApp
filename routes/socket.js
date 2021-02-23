const {Subject}=require('rxjs')
const ws=require('ws')
const mongoose=require('../mongoose.js');
const fs=require('fs')
// const Grid=require('gridfs-stream')
// Grid.mongo=mongoose.mongo
const connection=mongoose.connection
const MessageSchema=new mongoose.Schema({
    text:String,
    onlineNumber:String,
    date:String,
    port:String,
    nickName:String,
})
const Message=new mongoose.model('message',MessageSchema)
const sendSubject=new Subject()
const connectSubject=new Subject()
//后端监听端口以连接客户端发来的websocket请求
connectSubject.subscribe(port=>{
    const io=new ws.Server({
        port:port,
    })
    io.on("connection", async (wsObj)=>{
        onlineNumber++
        const date=new Date().toLocaleString('chinese',{hour12:false})
        //客户端第一次进来
        const historyMessages=await Message.find()
        wsObj.send(JSON.stringify(historyMessages))
        sendSubject.subscribe(data=>{
            wsObj.send(JSON.stringify(data))
        })
        //在线人数的改变
        sendSubject.next({onlineNumber})
        wsObj.on('message',(objText)=>{
            //消息的改变
            const obj=JSON.parse(objText)
            const {text,nickName,deleteId}=obj
            if(deleteId){
                // 很奇怪，要有下面的这个()=>{}
                Message.deleteOne({_id:deleteId},()=>{})
            }else{
                const messageObj={
                    text,
                    onlineNumber,
                    date,
                    port,
                    nickName,
                }
                const message=new Message(messageObj)
                message.save((err,newMessage)=>{})
                sendSubject.next(message);
            } 
        })
        wsObj.on('close',()=>{
            onlineNumber--
            sendSubject.next({
                onlineNumber,
            });
        })
    })
})

//初始化端口和在线人数
const firstPort=3001
let port=firstPort
let onlineNumber=0

//路由相关
const express = require('express');
const { stringify } = require('qs');
const router = express.Router()
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
