const { connect } = require('http2');
const ws = require('nodejs-websocket')
const TYPE_ENTER = 0
const TYPE_LEAVE = 1
const TYPE_TEXT = 2

/*
   消息不应该是有一个简单的字符串,而是一个对象。这个对象中可以包含的属性:
    1.type:消息类型 0:进入聊天室 1:离开聊天室 2：正常的聊天
    2.msg:消息的内容
    3.time: 聊天的具体时间
 */

let count = 0  // 连接用户数
const server = ws.createServer(conn => {  
  // 新用户连接
  console.log('有新的连接')
  count ++  
  conn.userName = `用户${count}` 
  // 广播新用户数据到客户端
  broadcast({
    type: TYPE_ENTER, // 直接写数字0不好维护,因此此处用常量表示
    msg: `${conn.userName}进入了直播间`,
    time: new Date().toLocaleDateString(),
  })

  // 某个用户发送信息
  conn.on('text', data => {
    // 广播聊天信息
    broadcast({
      type: TYPE_TEXT,
      msg: data,
      time: new Date().toLocaleDateString(), 
    })
  })

  // 某个用户关闭连接
  conn.on('close', data =>{
    console.log('关闭连接');
    count--
    broadcast({
      type: TYPE_LEAVE,
      msg: `${conn.userName}离开了聊天室`,
      time: new Date().toLocaleDateString(), 
    })
  })

  // 发生异常 
  // 注意：用户主动关闭浏览器会触发close事件+异常
  conn.on('error', data =>{
    console.log('发生异常');
  })
})

// 广播,给所有用户发送消息
function broadcast(msg) {
  // server.connections：存储所有用户conn对象的数组
  server.connections.forEach(item => {
    // send:只能传递字符串或Buffer,不能传递对象
    item.send(JSON.stringify(msg))
  })
}

server.listen(3000, () => {
  console.log('服务已经启动,端口3000监听中...');
})