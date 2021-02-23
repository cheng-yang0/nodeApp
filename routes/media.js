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
            const inputFile = files.file[0];
            const originalFilename=inputFile.originalFilename
            const newPath=path.resolve(`${form.uploadDir}/${inputFile.originalFilename}`)
            fs.renameSync(inputFile.path, newPath);
            const ip=os.type()=='Linux' ? '8.131.57.124' : localIp
            res.send({data:`http://${ip}:3000/${originalFilename}`})
            
        } catch (err) {
            res.send({ err: "上传失败！" })
        };
    })
});
module.exports = router;

