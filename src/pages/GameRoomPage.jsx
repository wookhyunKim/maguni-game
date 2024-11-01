import { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { joinSession } from '../../openvidu/app_openvidu.js';
import '../styles/gameroompage.css'
import StatusBar from '../components/layout/StatusBar.jsx';
import ForbiddenWordlistModal from '../components/modals/forbiddenWordlistModal.jsx';
import Footer from '../components/layout/Footer.jsx';
import useRoomStore from '../components/store/roomStore.js';
import { usePlayerStore } from '../components/store/playerStore.js';
import IMG from "../../src/assets/images/dish.png"
import axios from 'axios';

const GameRoomPage = () => {
    const videoSize = {
        width: 640,
        height: 480
    }

    //username, roomcode를 가져옴
    const username = usePlayerStore(state => state.username)
    const roomcode = useRoomStore(state => state.roomcode)

    //게임진행 소켓 상태관리
    const [socket, setSocket] = useState(null);
    const [participantList, setParticipantList] = useState([]); //유저네임 리스트
    const [forbiddenWordCount, setForbiddenWordCount] = useState({}); //유저별 금칙어 사용횟수

    //DB에서 가져온 유저별 금칙어 리스트
    const [forbiddenWordlist, setForbiddenWordlist] = useState([]);

    // 음성인식 관련 상태
    const [isStoppedManually, setIsStoppedManually] = useState(false); //수동 종료


    // ========================== 금칙어 설정 완료 ================
    // DB에서 유저별 금칙어 리스트 가져오기 => forbiddenWordlist
    const getPlayersInfo = () => {
        return axios({
            method: "GET",
            url: `http://localhost:3001/member/api/v1/word/${roomcode}`,
        }).then((res) => {
            setForbiddenWordlist(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    // ========================== 추가 기능 =====================
    function nameCanvas() {
        const videoContainer = document.getElementById("video-container");
        if (!videoContainer) return;
        const canvas = document.createElement("canvas");
        canvas.width = videoSize.width;
        canvas.height = videoSize.height;
        canvas.style.position = "absolute";
        canvas.style.top = videoContainer.offsetTop + "px";
        canvas.style.left = videoContainer.offsetLeft + "px";
        canvas.style.zIndex = "10";
        const ctx = canvas.getContext("2d");
        ctx.font = "12px serif";
        ctx.fillText(username, 10, 50);
        videoContainer.parentNode.insertBefore(canvas, videoContainer.nextSibling);
    }
    function wordonCanvas() {
        const videoContainer = document.getElementById("video-container");
        if (!videoContainer) return;
        const canvas = document.createElement("canvas");
        canvas.width = videoSize.width;
        canvas.height = videoSize.height;
        canvas.style.position = "absolute";
        canvas.style.top = videoContainer.offsetTop + "px";
        canvas.style.left = videoContainer.offsetLeft + "px";
        canvas.style.zIndex = "10";
        const ctx = canvas.getContext("2d");
        ctx.font = "40px serif";
        ctx.fillText(forbiddenWordlist.find(e => e.nickname === username)?.words, 400, 50);
        videoContainer.parentNode.insertBefore(canvas, videoContainer.nextSibling);
    }
    function bulchikonCanvas() {
        // video-container 요소를 찾음
        const videoContainer = document.getElementById("video-container");

        // video-container가 없으면 함수 종료
        if (!videoContainer) return;

        const canvas = document.createElement("canvas");
        canvas.width = videoSize.width;
        canvas.height = videoSize.height;
        canvas.style.position = "absolute";
        canvas.style.top = videoContainer.offsetTop + "px";
        canvas.style.left = videoContainer.offsetLeft + "px";
        canvas.style.zIndex = "10";

        // 부모 요소에 canvas 추가
        videoContainer.parentNode.insertBefore(canvas, videoContainer.nextSibling);

        const img = new Image();
        img.src = IMG; // 이미지 소스 설정
        const WIDTH = 280;
        const HEIGHT = 120;
        let yPosition = -HEIGHT; // 시작 위치는 캔버스 위쪽 바깥
        const targetY = videoSize.height / 2 - HEIGHT / 2; // 목표 위치 (중앙)

        const ctx = canvas.getContext("2d");

        img.onload = () => {
            // 애니메이션 함수 정의
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 초기화

                // 현재 위치에 이미지 그리기
                ctx.drawImage(img, WIDTH / 2, yPosition - 200, WIDTH, HEIGHT); // 수평 중앙 정렬

                // 목표 위치까지 이동
                if (yPosition < targetY) {
                    yPosition += 5; // 속도 조절 (숫자가 커질수록 빨라짐)
                    requestAnimationFrame(animate); // 다음 프레임 요청
                } else {
                    // 목표에 도달하면 멈춤
                    setTimeout(() => {
                        canvas.remove(); // 2초 후에 캔버스 제거
                    }, 1500);
                }
            }

            animate(); // 애니메이션 시작
        };

    }


    // =========================== Join ========================
    function connectToRoom() {
        const _socket = io('http://localhost:3002', {
            autoConnect: false,
            query: {
                username,
                roomcode,
            }
        });
        _socket.connect();
        setSocket(_socket);

        //update 유저 리스트 
        _socket.on('participant list', (users) => {
            setParticipantList(users);
        });

        //update 금칙어 count list
        _socket.on('update forbidden word count', (countlist) => {
            setForbiddenWordCount(countlist);
        });
    }

    const handleForbiddenWordUsed = (occurrences) => {
        socket.emit('forbidden word used', username, occurrences);
    };

    // =========================== 방나가기 ========================
    function disconnectFromRoom() {
        socket?.disconnect();
        setParticipantList([]);
        setForbiddenWordCount({});
    }

    // ======================== 음성인식시작 ========================
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.continuous = true;
        recognition.interimResults = true;

        
        const handleStart = () => {
            console.log("시작");
            setIsStoppedManually(false);
            recognition.start();
        };
        
        recognition.onstart = () => {
            console.log('녹음이 시작되었습니다.');
            document.getElementById('startButton').disabled = true;
            document.getElementById('stopButton').disabled = false;
        };
        
        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const result = event.results[i];
                const transcript = result[0].transcript.trim();
                
                if (result.isFinal) {
                    finalTranscript += transcript + ' ';
                    // 금칙어 카운트 수정
                    const word = forbiddenWordlist.find(e => e.nickname === username)?.words;
                    console.log(forbiddenWordlist);
                    console.log(word);
                    
                    if (word) {
                        const occurrences = (transcript.match(new RegExp(word, 'g')) || []).length;
                        console.log('금칙어 발생 횟수:', occurrences);
                        if (occurrences > 0) {
                            handleForbiddenWordUsed(occurrences);
                        }
                    }
                } else {
                    interimTranscript += transcript + ' ';
                }
            }
            
            const transcriptElement = document.getElementById('subtitles');
            if (transcriptElement) {
                transcriptElement.innerText = finalTranscript + interimTranscript;
            }
        };
        
        const handleStop = () => {
            setIsStoppedManually(true);
            startButton.disabled = false;
            stopButton.disabled = true;
            recognition.stop();
        };
        
        recognition.onend = () => {
            console.log('녹음이 종료되었습니다.');
            if (!isStoppedManually) {
                console.log('자동으로 음성 인식 재시작');
                recognition.start();
            }
        };

        // 버튼
        const startButton = document.getElementById('startButton');
        const stopButton = document.getElementById('stopButton');
        startButton?.addEventListener('click', handleStart);
        stopButton?.addEventListener('click', handleStop);
        
        recognition.onerror = (event) => {
            console.error('음성 인식 오류:', event.error);
            if (event.error !== 'no-speech') {
                recognition.stop();
                recognition.start();
            }
        };
        
        // Clean up
        return () => {
            recognition.stop();
            startButton?.removeEventListener('click', handleStart);
            stopButton?.removeEventListener('click', handleStop);
        };
    }, [forbiddenWordlist]);
    // ================================================================================================================

    return (
        <>
            <StatusBar />
            <div id="main-container" className="container">
                {/* ---------- 대기실 2 ----------*/}
                <div id="join">
                    <div id="join-dialog" className="jumbotron vertical-center">
                        <h1>Join a video session</h1>
                        <form className="form-group" onSubmit={(e) => {
                            e.preventDefault();  // 기본 제출 동작 방지
                            joinSession();
                            connectToRoom();
                        }}>
                            <p>
                                <label>Participant</label>
                                <input className="form-control" type="text" id="userName" required defaultValue={username} />
                            </p>
                            <p>
                                <label>Session</label>
                                <input className="form-control" type="text" id="sessionId" required defaultValue={roomcode} />
                            </p>
                            <p className="text-center">
                                <input className="btn btn-lg btn-success" type="submit" name="commit" value="Join!" />
                            </p>
                        </form>
                    </div>
                </div>
                {/* ---------- Join - 게임 ----------*/}
                <div id="session" style={{ display: 'none' }}>
                    <div id="session-header">
                        <h1 id="session-title"></h1>
                    </div>
                    <div id="session-body">
                        <div className="main-content">
                            <div id="main-video" className="col-md-6">
                                <p></p><div className="webcam-container" style={{ position: 'relative', height: videoSize.height, width: videoSize.width }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0 }}>
                                        <video id="myVideo" autoPlay playsInline width={videoSize.width} height={videoSize.height}></video>
                                    </div>
                                    <div style={{ position: 'absolute', top: 0, left: 0 }}>
                                        {/* <canvas ref={canvasRef} width={videoSize.width} height={videoSize.height} className="filter-canvas"></canvas> */}
                                    </div>
                                </div>
                                <div className="App">
                                    <h1>방 접속 페이지</h1>
                                    <>
                                        <button onClick={getPlayersInfo}>금칙어 설정 완료</button>
                                        <button onClick={disconnectFromRoom}>방 나가기</button>
                                        <button id="startButton">음성인식시작</button>
                                        <button id="stopButton" disabled>음석 인식 종료</button>
                                        <button id="bulchikonCanvas" onClick={bulchikonCanvas}>벌칙</button>
                                        <button id="nameCanvas" onClick={nameCanvas}>이름</button>
                                        <button id="wordonCanvas" onClick={wordonCanvas}>금칙어</button>
                                        <div
                                            id="subtitles"
                                            style={{
                                                position: 'absolute',
                                                bottom: '10px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                color: 'white',
                                                background: 'rgba(0, 0, 0, 0.7)',
                                                padding: '10px',
                                                borderRadius: '5px',
                                                fontSize: '18px',
                                                zIndex: 1000,
                                            }}
                                        >
                                            자막
                                        </div>
                                    </>
                                </div>
                            </div>
                            <div id="video-container" className="col-md-6">
                            </div>
                        </div>

                        <div className="gameroom-sidebar">
                            <div className="sidebar_wordlist">
                                <div className="sidebar_index">금칙어 목록</div>
                                <div className="sidebar_content">
                                    <table className="user-wordlist-table">
                                        <tbody>
                                            <ul>
                                                {participantList.map(user => (
                                                    // user !== username && ( // 자신이 아닌 경우에만 표시
                                                    <li key={user}>
                                                        {user} - {forbiddenWordlist.find(e => e.nickname === user)?.words || '금칙어 없음'}
                                                        - 금칙어 카운트: {forbiddenWordCount[user] || 0}
                                                    </li>
                                                    // )
                                                ))}
                                            </ul>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="sidebar_mymission">
                                <div className="sidebar_index">나의 미션</div>
                                <div className="sidebar_content">
                                    <table className="user-wordlist-table">
                                        <tbody>
                                            <tr>
                                                <td>미션 내용</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="sidebar_goongye">
                                <div className="sidebar_index">진행자</div>
                                <div className="sidebar_content">
                                    <table className="user-wordlist-table">
                                        <tbody>
                                            <tr>
                                                <td>진행자 정보</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ForbiddenWordlistModal forbiddenWordlist={forbiddenWordlist} setForbiddenWordlist={setForbiddenWordlist}/>
            <Footer username={username} roomcode={roomcode} participantList={participantList} setParticipantList={setParticipantList}/>
        </>
    );
};

export default GameRoomPage;