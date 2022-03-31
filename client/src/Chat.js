import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

//
//
function Chat({ socket, userName, roomName }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: roomName,
        author: userName,
        message: currentMessage,
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      const { room, author, message } = messageData;
      const messages = JSON.parse(localStorage.getItem("messages")) || [];

      const addMsg = (messageData) => {
        messages.push({
          room,
          author,
          message,
        });

        localStorage.setItem("messages", JSON.stringify(messages));

        return { room, author, message };
      };
      addMsg();
    }
    setCurrentMessage("");
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data.room);
      const messages = JSON.parse(localStorage.getItem("messages")) || [];

      setMessageList(() => [...messages, data]);
    });
  }, [socket, messageList]);
  return (
    <div>
      <h3>Chat Room :</h3>
      <div className="chatBox">
        <ScrollToBottom className="scroll">
          {messageList.map((msg) => {
            return (
              <div key={messageList.message}>
                <div
                  className="msgContainer"
                  id={userName === msg.author ? "you" : "other"}
                >
                  <div>
                    <p className="sender">
                      {msg.author} in room {msg.room}{" "}
                    </p>{" "}
                    :
                  </div>

                  <div>
                    <p className="senderMsg"></p>
                    {msg.message}
                  </div>
                </div>
                <div></div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Write something..."
          value={currentMessage}
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
