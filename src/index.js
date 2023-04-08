var express = require("express");
const { response } = require("express");
const app = express();

//to start the app on index.html
app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html');
});
console.log("Listening on PORT 3000");

const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
app.use(express.static(path.join(__dirname,"../public/")));

server.listen(3000);
//new
io.on("connection",function(socket){
    console.log("Connection");
    socket.on("join",function(room,room_pass){
        group=room+room_pass;
        socket.join(group);
    });
    socket.on("newuser",function(username,room,room_pass){
        group=room+room_pass;
        socket.to(group).emit("update",username+" joined the conversation");
    });
    socket.on("exituser",function(username,room,room_pass){
        group=room+room_pass;
        socket.to(group).emit("update",username+" left the conversation");
        
    });
    socket.on("chat",function(message,room,room_pass){
        group=room+room_pass;
        socket.to(group).emit("chat",message);
    });
});