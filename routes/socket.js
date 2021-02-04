const {Subject}=require('rxjs')
const subject=new Subject()
const sendSubject=new Subject()
const ws=require('ws')
const os=require('os')
let port=3001
//新页面一开始就能得到数据
let commonData=''
subject.subscribe(val=>{
    const io=new ws.Server({
        host:os.hostname,
        port:port,
    })
    console.log(`listening at ${port}`);
    io.on("connection", (wsObj)=>{
        console.log(`connect in ${port}`);
        wsObj.send(commonData)
        if(port>4000){
            port=3001
        }else{
            port++
        }
        subject.next(port)
        wsObj.on('message',(data)=>{
            console.log(data);
            commonData=data
            sendSubject.subscribe(data=>{
                wsObj.send(data)
            })
            sendSubject.next(data)
        })
    });      
})
subject.next(port)

//路由相关
const express = require('express');
const router = express.Router();
router.get('/', function(req, res, next) {
    res.send({
        port:port
    })
});
module.exports = router;


// wsObj.on("close", function() {
//     // console.log("request close");
// });

// wsObj.on("error", function(err) {
//     // console.log("request error", err);
// });
