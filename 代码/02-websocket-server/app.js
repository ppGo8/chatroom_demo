/**
 * @描述: nodejs实现websocket的服务
 */

// 1.导入包
const { log } = require('console')
const { connect } = require('http2')
const ws = require('nodejs-websocket')

// 2.创建一个server
// 2.1 如何处理用户的请求? 
// 每次只要有用户连接上来,就会调用里面的回调函数,同时创建了connect对象
const server = ws.createServer(connect => {
  console.log('有用户连接上来了');
  // text事件：接受到用户传递的数据，text事件就会被触发
  connect.on('text',data => {
    console.log('接受到了用户的数据', data);
    // send方法: 发送给用户响应的数据
    // 处理用户发送的数据，把小写转换成大写
    connect.send(data.toUpperCase() + '!!!')
  })

  // close事件：websocekt连接关闭
  connect.on('close', ()=>{
    console.log('连接断开了');
   
  })

  // error事件: 处理用户的错误信息
  // 注意点: ws断开连接需要处理一个error事件不然会报错
  connect.on('error',()=>{
    // 关闭时也会触发这个事件
    console.log('用户连接异常');
  })
})

// 3.监听端口
const PORT = 3000
server.listen(PORT || 3000, ( )=> {
  console.log('websocket服务启动层共了,监听了端口' + PORT);
})