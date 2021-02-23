const interfaces = require('os').networkInterfaces(); // 在开发环境中获取局域网中的本机iP地址
let ipAdress = '';
for(let devName in interfaces){
    const interface=interfaces[devName]
    interface.forEach(alias=>{
        if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
            ipAdress = alias.address;  
        }
    })
}
console.log(ipAdress);
exports.ip=ipAdress
