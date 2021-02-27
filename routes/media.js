const express = require('express');
const path=require('path')
const os=require('os')
const multiparty=require('multiparty')
const fs=require('fs')
const jwt=require('jsonwebtoken')
const router = express.Router();
const mongoose=require('../mongoose.js');
const { multiply } = require('lodash');
const UserSchema=new mongoose.Schema({
	userName:String,
	password:String
})
const localIp=require('../util/ip').ip
router.post('/', async (req, res)=>{ 
    const form=new multiparty.Form()
    form.encoding = 'utf-8';
    form.uploadDir=path.resolve('../media')
    form.parse(req, function (err, fields, files) {
        try {          
            //源文件
            const ip=os.type()=='Linux' ? '8.131.57.124' : 'localhost'
            for(let key in files){ 
                const file=files[key][0]
                const originalFilename=(key==='minImg' ? '缩略图：':'')+file.originalFilename
                console.log(originalFilename);
                const newPath=path.resolve(`${form.uploadDir}/${originalFilename}`)
                fs.renameSync(file.path, newPath);
                //存在缩略图的话就不发原图去聊天记录了
                console.log(1);
                if(!(key=='file' && files.minImg)){
                    res.send({data:`http://${ip}:3000/${originalFilename}`})
                }
            }      
        } catch (err) {
            res.send({ err: "上传失败！" })
        };
    })
});
module.exports = router;


