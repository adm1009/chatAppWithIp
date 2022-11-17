import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
const socket = io.connect("http://192.168.1.111:3010");

function App() {
  const [room, setRoom] = useState("");
  const [username,setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [userleft,setUserleft] =useState("");
  const [messageReceived, setMessageReceived] = useState([]);
  const [showmessage, setShowMessage] = useState(false);
  const [count,setCount] = useState(0);

  const joinRoom = () => {
    
    if (room !== "" && username!=="") {
      setShowMessage(true);
      socket.emit("join_room", {roomid:room,username:username});

    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { msgList:messageReceived,msg:message, roomid:room , username:username });
  };

  const Leavechat = () =>{
    setShowMessage(false);
    socket.emit("leaveroom",{username:username,roomid:room})
  }

  useEffect(() => {
    socket.on("noofuser",(data)=>{
        setCount(data);
    })
    socket.on("receive_message", (data) => {
      setMessageReceived([...data.msgList,`${data.username}:${data.msg}`]);
    });
    socket.on("userleft",(data)=>{
      setUserleft(`${data.username} has left chat.`);
      setCount(data.usercount);
    })
  }, [socket]);
  return (
    
    <div className="App">
      
      <h3 className={!showmessage ? "heading" : "headingInside"} ><img src="/chat2.png" className="imgdata" style={{marginRight:"1rem",marginLeft:"-1rem"}}/>Infogen Chatting Platform</h3>
      {!showmessage && <div className="logindata">
      {!showmessage && <input
        placeholder="Enter username..."
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />}
      <br />
      {!showmessage && <input
        placeholder="Enter roomNo..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />}
      <br />
      {!showmessage && <button onClick={joinRoom}> Join Room</button>}
      </div>}
      {showmessage &&<div className="userroomdata">
      {showmessage && <h3 style={{display:"inline"}}>🟢Online:-{count} </h3> }
      {showmessage && <h3 style={{display:"inline",marginLeft:"25px"}}>Username:-{username}</h3>}
      {showmessage && <h3 style={{display:"inline",marginLeft:"25px"}}>RoomId:-{room}</h3>}
      </div>}
      <br/>
      {showmessage && <div className="messagesdata">
      {showmessage && <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }} 
      />}
      {showmessage && <button onClick={sendMessage}> Send Message</button>}
      {showmessage && <button onClick={Leavechat}>Leave Chat</button> }
      {showmessage && <h4 style={{color:"grey"}}>CHATTING:</h4>}
      {showmessage && messageReceived.map(data => <ScrollToBottom>{data}</ScrollToBottom>)}
      <div style={{color:"red"}}>{userleft}</div>
      </div>}
    </div>
  );
}

export default App;
