import { useState, useEffect } from 'react'
import './App.css'

//
import { io } from "socket.io-client";

function App() {
  const [isConnected, setIsConnected] = useState(false);

  const [messages, setMessages] = useState([]);

  const [username, setUsername] = useState('');

  const [userInput, setUserInput] = useState('');

  const [socket, setSocket] = useState(null);

  const [forbiddenWord, setForbiddenWord] = useState('');

  const [forbiddenWords, setForbiddenWords] = useState([]);

  function connectToChatServer() {
    console.log('connectToChatServer');
    const _socket = io('http://localhost:3000', {
      autoConnect: false,
      query: {
        username: username,
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
    socket?.emit("new message", { username: username, message: userInput, forbiddenWord: forbiddenWord }, (response) => {   //메세지 서버로 전송
      console.log(response);
    });
    setUserInput('');
  }

  function onMessageRecieved(msg) {
    console.log('프론트 - onMessageReceived');
    console.log(msg);

    setMessages(previous => [...previous, msg]);

    if (msg.message.includes('중요')) {
      alert(`관리자 공지: ${msg.message}`);
    }

  }

  function forbiddenWordRecieved(word) {
    setForbiddenWord(word);
    // alert(`랜덤 금칙어: ${word}`); // 금칙어를 알림으로 표시
  }

  function updateforbiddenWordList(list) {
    console.log('updateforbiddenWordList');

    const filteredList = list.filter(word => word.username !== username); // 자신의 username과 일치하는 항목 제외
    setForbiddenWords(filteredList);
  }


  function useforbiddenWord(alertMessage) {
    alert(alertMessage); // 금칙어 사용 알림
  }




  function handleKeyUp(event) {
    if (event.key === 'Enter') {
      sendMessageToChatServer(); // Enter 키를 누르면 메시지 전송
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: "smooth"
    })
  }, [messages]);


  useEffect(() => {   //소켓 별 이벤트 리스너
    console.log('useEffect called!');
    socket?.on('connect', onConnected); //서버랑 연결이 되면
    socket?.on('disconnect', onDisconnected); //서버로부터 연결이 끊어지면
    socket?.on('new message', onMessageRecieved); //서버로부터 새 메세지를 받으면
    socket?.on('forbidden word', forbiddenWordRecieved); //금칙어 지정
    socket?.on('alert forbidden word', useforbiddenWord); //금칙어 사용했다 알림을 받으면
    socket?.on('forbidden word list', updateforbiddenWordList);


    return () => {
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
      <div className='Navbar'>
        <h1>유저: {username}</h1>
        <h3>접속상태: {isConnected ? "접속중" : "미접속"}</h3>
        <div className="Card">
          {/* 접속 상태에 따라 입력 필드와 버튼 표시 */}
          {isConnected ? (
            <button onClick={disconnectToChatServer}>접속종료</button>
          ) : (
            <>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="사용자 이름을 입력하세요"
              />
              <button onClick={connectToChatServer}>접속하기</button>
            </>
          )}
        </div>

        <div class="split-container">
          <div class="left-section">
            <ul className='Chatlist'>
              <li className='welcome-message'>금칙어 게임에 오신것을 환영합니다!</li>
              {messageList}
            </ul>
          </div>
          <div class="right-section">
            <div>
              <div className="container mt-4">
                <h3>금칙어 목록</h3>
                <table className="table table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">유저</th>
                      <th scope="col">금칙어</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forbiddenWords.map((word, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{word.username}</td>
                        <td>{word.forbiddenword}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="MessageInput">
        <input value={userInput} onChange={e => setUserInput(e.target.value)} onKeyUp={handleKeyUp} placeholder='메세지를 입력하세요' />
        <button onClick={() => sendMessageToChatServer()}>
          보내기
        </button>
      </div>
    </>
  )
}

export default App
