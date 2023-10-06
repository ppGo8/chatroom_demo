const { connect } = require('http2');
const ws = require('nodejs-websocket')

// 当前连接上来的用户数量
let count = 0 
const server = ws.createServer(conn => {  
  // 当有新人进入聊天室
  // 每个进入聊天室的对象,都会有自己的conn对象;可以在这个对象上添加属于每一个用户的属性
  console.log('有新的连接!');
  count ++  // 人数+1
  // 新用户起名字
  conn.userName = `用户${count}` 
  // 1.有用户加入的聊天室,告诉所有人
  broadcast(`${conn.userName}进入了聊天室`)


  // 接收到了浏览器的数据 触发
  conn.on('text', data => {
    // 2.接收到某个用户的消息,告诉所有人
    broadcast(data)
  })

  // 关闭连接时 触发
  conn.on('close', data =>{
    console.log('关闭连接');
    count--
    // 3.有用户离开时,告诉所有人
    broadcast(`${conn.userName}离开了聊天室`)
  })

  // 发生异常时 触发(用户主动关闭浏览器连接就会发生异常)
  conn.on('error', data =>{
    console.log('发生异常');
  })
})

// 广播,给所有用户发送消息
function broadcast(msg) {
  // server.connections：存储所有用户conn对象的数组
  server.connections.forEach(item => {
    item.send(msg)
  })
}

server.listen(3000, () => {
  console.log('服务已经启动,端口3000监听中...');
})