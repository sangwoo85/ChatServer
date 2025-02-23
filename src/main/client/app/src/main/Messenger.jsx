import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./Messenger.css";

var chatListData = [
  {
    name: "Saved 222",
    lastMessage: "Used for gradient stops in elevation",
    time: "9:54 PM",
  },
  {
    name: "Designers",
    lastMessage: "You: 🎙️ Poll",
    time: "4:27 PM",
  },
  {
    name: "Cody Fisher",
    lastMessage: "I'll be there in 2 mins",
    time: "10:12 AM",
  },
  {
    name: "Albert Flores",
    lastMessage: "aww",
    time: "Tue",
  },
  {
    name: "Bessie Cooper",
    lastMessage: "Haha that's terrifying 😂",
    time: "Tue",
  },
  {
    name: "Ronald Richards",
    lastMessage: "Sure, let's do it!",
    time: "Mon",
  },
  {
    name: "Ralph Edwards",
    lastMessage: "Any updates?",
    time: "Mon",
  },
];

const initialMessages = [
  {
    sender: "Designers",
    message: `To check out what a native Windows Telegram app looks like, you can try Unigram. It is possible that the best design solutions will be implemented into Unigram. To check the functionality of Telegram desktop apps, please refer to https://desktop.telegram.org`,
    date: "9:54 PM",
  },
  {
    sender: "You",
    message: "What do you think?",
    date: "9:54 PM",
  },
];

export default function DesktopMessenger() {
  const [selectedChat, setSelectedChat] = useState(chatListData[1]); // 기본 선택: "Designers"
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const [stompClient, setStompClient] = useState(null);

  useEffect(()=>{
    const socket = new SockJS("http://localhost:8090/ws")
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders :{userId: "ksswy"},
      onConnect: () =>{
        console.log("Connect to WEbsocket");
/*
        client.subscribe("/topic/public",(message) => {
          const receiveMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receiveMessage])
        })
          */
        client.subscribe("/queue/messages/ksswy",(message) => {
          console.log("message reiceve");
          const receiveMessage = JSON.parse(message.body);
          console.log(receiveMessage);
          setMessages((prev) => [...prev, receiveMessage])

        })
      },
      onDisconnect: () => console.log("Disconnect")
    })
    client.activate();
    setStompClient(client);

    return () => client.deactivate(); // 컴포넌트 언마운트 시 연결 해제
  },[]);

  const handleSendMessage = () => {
    console.log("send btn click");
    if(!inputText.trim() || !stompClient) return;
    const newMsg = {
      sender: "ksswy",
      receiver : "ksswy",
      message : inputText.trim(),
      date : new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}),
      type : "1"
    };

    stompClient.publish({
      destination :"/app/private-message",
      body:JSON.stringify(newMsg)

    })

    setInputText("");//초기화
  }



  // 사이드바에서 채팅 목록 클릭 시
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    // 실제로는 서버에서 해당 채팅에 대한 메시지를 불러오는 로직이 필요
    setMessages(initialMessages);
  };

  return (
    <div className="messenger-container">
      {/* 왼쪽 사이드바 */}
      <div className="sidebar">
        <div className="sidebar-header">Telegram</div>
        <input className="search-box" placeholder="Search" />
        <div className="chat-list">
          {chatListData.map((chat, idx) => (
            <div
              key={idx}
              className="chat-item"
              onClick={() => handleSelectChat(chat)}
            >
              <div className="chat-avatar">
                {chat.name.charAt(0)}
              </div>
              <div className="chat-info">
                <div className="chat-name">{chat.name}</div>
                <div className="chat-last-message">{chat.lastMessage}</div>
              </div>
              <div className="chat-time">{chat.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 채팅창 */}
      <div className="chat-window">
        {/* 채팅 헤더 */}
        <div className="chat-header">
          <div className="chat-avatar">D</div>
          <div className="chat-header-title">
            {selectedChat ? selectedChat.name : "No Chat Selected"}
          </div>
        </div>

        {/* 메시지 목록 */}
        <div className="chat-messages">
          {messages.map((msg, idx) => {
            const isMe = msg.sender === "You";
            return (
              <div
                key={idx}
                className={`message ${isMe ? "message-right" : "message-left"}`}
              >
                <div className="message-content">
                  <div>{msg.message}</div>
                  <div className="message-time">{msg.date}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 메시지 입력 */}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Write a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}