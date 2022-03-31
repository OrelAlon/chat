import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
//
//
//
const socket = io.connect("http://localhost:5000");

function App() {
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (userName !== "" && roomName !== "") {
      socket.emit("join_room", roomName);
      console.log(userName, roomName);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h1>messaging app</h1>
          <input
            type="text"
            placeholder="Enter Your Name..."
            onChange={(event) => {
              setUserName(event.target.value);
            }}
          />
          <div>
            <input
              type="text"
              placeholder="Enter a Room..."
              onChange={(event) => {
                setRoomName(event.target.value);
              }}
            />
          </div>
          <div>
            <button onClick={joinRoom}>Join A Room</button>
          </div>
        </div>
      ) : (
        <Chat socket={socket} userName={userName} roomName={roomName} />
      )}
    </div>
  );
}

export default App;
