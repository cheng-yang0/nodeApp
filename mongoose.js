const mongoose = require('mongoose') // 引入 mongoose
const url = "mongodb://localhost:27017/xxx"; // 本地数据库地址
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})
module.exports=mongoose
// const TriangleSchema=new mongoose.Schema({
//     line:Number,
//     angle:Number
// })
// const Triangle = mongoose.model('Triangle', TriangleSchema)
// const triangle = new Triangle({ line: 666, angle: 60 })
// triangle.save(function (err, newTriangle) { // 保存到数据库
//     console.log('我已经在商店中了')
// })
