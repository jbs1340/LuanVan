const io = require('socket.io-client');
var socket = io('http://10.110.8.100/jms/v1', {
    transportOptions: {
        polling: {
            extraHeaders: {
                "X-APIKEY": 'eXVoLXNlcnZpY2UtY29ubmVjdGVk'
            }
        }
    },
    reconnection: true
})


socket.on('connect', (data) => {
    if (socket.connected) {
        console.log("Socket JMS started")
    }
})

socket.on('disconnect', () => {
    console.log("Socket JMS disconnected")
})

socket.on('error', socket => {
    console.log(socket)
})

socket.on('/mission/done', data => {})

socket.on('error-message', data => {
    console.log(data)
})

module.exports = {
    socket,
}