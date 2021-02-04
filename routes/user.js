const express = require('express');
const jwt=require('jsonwebtoken')
const router = express.Router();
const mongoose=require('../mongoose.js');
const UserSchema=new mongoose.Schema({
	userName:String,
	password:String
})
const User=new mongoose.model('user',UserSchema)
/* GET user listing. */

//注册
router.post('/register', async (req, res)=>{
	console.log('xixi');
	
	const {userName}=req.body
	const userFindByName=await User.find({userName:userName})
	if(userFindByName.length===0){
		const user=new User({
			userName:userName,
			password:req.body.password
		})	
		user.save((err,newUser)=>{
			if(err){
				res.send({
					status:'failed'
				})
			}else{
				res.send({
					status:'success',
				})
			}
		})
	}else{
		res.send({
			status:'failed',
			message:'账号已存在'
		})
	}
});
//登录
router.post('/login', async (req, res)=>{
	const {userName,password}=req.body
	const userFindByName=await User.find({userName:userName})
	if(userFindByName.length===0){
		res.send({
			status:'failed',
			message:'账号或密码不对',
		})
	}else if(userFindByName[0].password===password){
		const token='Bearer'+jwt.sign(
			{userName:userName},
			'secret12345',
			{expiresIn:3600*24*3} 
		)
		res.send({
			status:'success',
			token:token
		})
	}else{
		res.send({
			status:'failed',
			message:'账号或密码不对'
		})
	}
});
module.exports = router;

