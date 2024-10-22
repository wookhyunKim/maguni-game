import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

//
import { io } from "socket.io-client";

function App() {
  const [count, setCount] = useState(0);

  const [isConnected, setIsConnected] = useState(false);

  const [messages, setMessages] = useState([]);
  
  const [username, setUsername] = useState('');

  const [userInput, setUserInput] = useState('');

  const [socket, setSocket] = useState(null);

  function connectToChatServer() {
    console.log('connectToChatServer');
    const _socket = io('https://reactsocketiochatapp.onrender.com/', {
      autoConnect: false,
      query: {
        username : username,
      }
    });
    _socket.connect();
    setSocket(_socket);
  }

  function disconnectToChatServer() {
    console.log('disconnectToChatServer');
    socket?.disconnect();
  }

  function onConnected() {
    console.log('프론트 - onConnected');
    setIsConnected(true);
  }

  function onDisconnected() {
    console.log('프론트 - onDisconnected');
    setIsConnected(false);
  }

  function sendMessageToChatServer() {
    console.log(`프론트 - sendMessageToChatServer input: ${userInput}`);
    socket?.emit("new message", { username: username, message: userInput }, (response) => {
      console.log(response); // "got it"
    });
  }

  function onMessageRecieved(msg) {
    console.log('프론트 - onMessageReceived');
    console.log(msg);

    setMessages(previous => [...previous, msg]);
  }

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: "smooth"
    })
  }, [messages]);


  useEffect(() => {
    console.log('useEffect called!');
    socket?.on('connect', onConnected);
    socket?.on('disconnect', onDisconnected);
    
    socket?.on('new message', onMessageRecieved);

    return() => {
      console.log('useEffect clean up function called!');
      socket?.off('connect', onConnected);
      socket?.off('disconnect', onDisconnected);
      socket?.off('new message', onMessageRecieved);
    };
  }, [socket]);

  const messageList = messages.map((aMsg, index) => 
    <li key={index}>
      {aMsg.username} :{aMsg.message}
    </li>
  );

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>

      <h1>유저: {username}</h1>
      <h3>현재 접속상태: {isConnected ? "접속중" : "미접속"}</h3>
      <div className="card">
        <input value={username} onChange={e => setUsername(e.target.value)} />
        <button onClick={() => connectToChatServer()}>
          접속
        </button>
        <button onClick={() => disconnectToChatServer()}>
          접속종료
        </button>
      </div>

      <div className="card">
        <input value={userInput} onChange={e => setUserInput(e.target.value)} />
        <button onClick={() => sendMessageToChatServer()}>
          보내기
        </button>
      </div>
      
      <ul>
        {messageList}
      </ul>
    </>
  )
}

export default App
