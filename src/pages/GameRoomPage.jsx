import { useEffect, useState } from 'react'
import io from 'socket.io-client';
import '../styles/gameroompage.css'
import StatusBar from '../components/layout/StatusBar.jsx';
import Footer from '../components/layout/Footer.jsx';
import useRoomStore from '../components/store/roomStore.js';
import { usePlayerStore } from '../components/store/playerStore.js';
import IMG from "../../src/assets/images/dish.png"
import axios from 'axios';

import { OpenVidu } from "openvidu-browser";
import { calculateFilterPosition } from "../../filter/calculate-filter-position.ts";
import { loadDetectionModel } from "../../filter/load-detection-model.js";
import SUNGLASS from "../assets/images/sunglasses.png";

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

    // openvidu
    let [OV,setOV] = useState(null);
    let [session,setSession] = useState(null);
    let subscribers = [];
    const [detectModel,setDetectModel] = useState();
    const FRAME_RATE = 30;
    const APPLICATION_SERVER_URL = "https://mmyopenvidu.onrender.com/";
    
    const [videoRef,setVideoRef] = useState(undefined);


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

    function beol(id) {
        const Old = document.getElementById(`canvas_${id}`);

        // video-container가 없으면 함수 종료
        if (!Old) return;

        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 480;
        canvas.style.position = "absolute";
        canvas.style.top = Old.offsetTop + "px";
        canvas.style.left = Old.offsetLeft + "px";
        canvas.style.zIndex = "1";

        // 부모 요소에 canvas 추가
        Old.parentNode.insertBefore(canvas, Old.nextSibling);

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
                ctx.drawImage(img, WIDTH / 2, yPosition - 100, WIDTH, HEIGHT); // 수평 중앙 정렬

                // 목표 위치까지 이동
                if (yPosition < targetY) {
                    yPosition += 5; // 속도 조절 (숫자가 커질수록 빨라짐)
                    requestAnimationFrame(animate); // 다음 프레임 요청
                } else {
                    // 목표에 도달하면 멈춤
                    setTimeout(() => {
                        canvas.remove(); // 2초 후에 캔버스 제거
                    }, 3000);
                }
            }

            animate(); // 애니메이션 시작
        };
    }

    // =========================== Join ========================
    function joinSession() {
        let mySessionId = document.getElementById("sessionId").value;
        let myUserName = document.getElementById("userName").value;
        OV = new OpenVidu();
        setOV(OV);
        session = OV.initSession();
        setSession(session);
    
        session.on("streamCreated", (event) => {
            let subscriber = session.subscribe(event.stream, "video-container");
    
            subscribers = [...subscribers, subscriber];
            subscriber.on("videoElementCreated", (event) => {
                // appendUserData(event.element, subscriber.stream.connection);
            });
        });
    
        session.on("streamDestroyed", (event) => {
            removeUserData(event.stream.connection);
            subscribers.filter((sub) => sub !== event.stream.streamManager);
        });
    

        session.on("exception", (exception) => {
            console.warn(exception);
        });
    
        getToken(mySessionId).then((token) => {
            session
                .connect(token, { clientData: myUserName })
                .then(() => {
                    OV.getUserMedia({
                        audioSource: false,
                        videoSource: undefined,
                        resolution: "640x480",
                        frameRate: FRAME_RATE,
                    }).then((mediaStream) => {
                        startStreaming( mediaStream);
                    });
                    document.getElementById("session-title").innerText =
                        mySessionId;
                    document.getElementById("join").style.display = "none";
                    document.getElementById("session").style.display = "block";
                })
                .catch((error) => {
                    throw(error);
                });
        });
    }
    

    const startStreaming = async ( mediaStream) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
    
        const video = document.createElement("video");
        video.srcObject = mediaStream;
        video.autoplay = false;
        video.muted =true;
        video.playsInline = true;
    
        const compositeCanvas = document.createElement("canvas");
        compositeCanvas.width = 640;
        compositeCanvas.height = 480;
        compositeCanvas.id = `canvas_${username}`;
        const ctx = compositeCanvas.getContext("2d");
        
        setVideoRef(video)

    
        // 비디오 메타데이터 로드 시 실행
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                startFiltering(video,ctx,compositeCanvas);
                resolve();
            };
        });
    
        // 캔버스에서 스트림 생성
        const compositeStream = compositeCanvas.captureStream(FRAME_RATE);
        const publisher = OV.initPublisher(undefined, {
            audioSource: mediaStream.getAudioTracks()[0],
            videoSource: compositeStream.getVideoTracks()[0],
            frameRate: FRAME_RATE,
            videoCodec: "H264",
        });
    
        await session.publish(publisher);
    
        // 캔버스를 화면에 추가
        const videoContainer = document.getElementById("video-container");
        videoContainer.appendChild(compositeCanvas);
    };

const beolFiltert = ()=>{
    if(!detectModel) {
        console.log("detect model is not loaded")
        return};

        const originCanvas = document.getElementById(`canvas_${username}`);

        const canvas = document.createElement("canvas");
        // 크기를 originCanvas와 동일하게 설정
        canvas.width = originCanvas.offsetWidth; 
        canvas.height = originCanvas.offsetHeight; 
        canvas.style.position = "absolute";
        canvas.style.top = originCanvas.offsetTop + "px";
        canvas.style.left = originCanvas.offsetLeft + "px";
        canvas.style.zIndex = "1";
        const ctx = canvas.getContext("2d");
        
        originCanvas.parentNode.insertBefore(canvas, originCanvas.nextSibling);


        const image = new Image();
        image.src = SUNGLASS;

        const startfi=()=>{
            detectModel.estimateFaces(canvas).then((faces) => {
                ctx.clearRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                ctx.drawImage(
                    videoRef,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                if (faces[0]) {
                    const { x, y, width, height } = calculateFilterPosition(
                        "eyeFilter",
                        faces[0].keypoints
                    );
                    ctx.drawImage(image, x, y, width, height);
                }
                requestAnimationFrame(startfi);
            })
        }
        requestAnimationFrame(startfi);
        setTimeout(() => {
            canvas.remove(); 
        }, 3000);

}

    const startFiltering = (video,ctx,compositeCanvas) => {
        if(!detectModel) return;

        let animationFrameID;
            const estimateFacesLoop = () => {
                    ctx.clearRect(
                        0,
                        0,
                        compositeCanvas.width,
                        compositeCanvas.height
                    );

                    ctx.drawImage(
                        video,
                        0,
                        0,
                        compositeCanvas.width,
                        compositeCanvas.height
                    );


                    requestAnimationFrame(estimateFacesLoop);

            };
            requestAnimationFrame(estimateFacesLoop);

        return () => {
            if (animationFrameID) {
                cancelAnimationFrame(animationFrameID);
            }
        };
    };

    
    function removeUserData(connection) {
        var dataNode = document.getElementById("data-" + connection.connectionId);
        dataNode.parentNode.removeChild(dataNode);
    }
    
    function removeAllUserData() {
        var nicknameElements = document.getElementsByClassName("data-node");
        while (nicknameElements[0]) {
            nicknameElements[0].parentNode.removeChild(nicknameElements[0]);
        }
    }
    
    function getToken(mySessionId) {
        return createSession(mySessionId).then((sessionId) =>
            createToken(sessionId)
        );
    }
    
function createSession(sessionId) {
    return new Promise((resolve, reject) => {
        axios.post(`${APPLICATION_SERVER_URL}api/sessions`, 
            { customSessionId: sessionId }, 
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        .then((response) => {
            resolve(response.data); // The sessionId
        })
        .catch((error) => {
            reject(error);
        });
    });
}

    
    function createToken(sessionId) {
        return new Promise((resolve, reject) => {
            axios.post(`${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`, {}, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then((response) => {
                resolve(response.data); // The token
            })
            .catch((error) => {
                reject(error);
            });
            
        });
    }
    
    // =========================== Join ========================
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

        _socket.on('hit user', (username, occurrences) => {
            console.log(occurrences);
            for (let i = 0; i < occurrences; i++) {
                setTimeout(() => {
                    console.log('click');
                    beol(username);
                }, i * 300); // 각 호출 사이에 300ms의 간격을 둡니다
            }
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


    // ======================== 모델로드 ========================
    useEffect(()=>{
        loadDetectionModel().then((model) => {
            // console.log("model : ", model)
            setDetectModel(model);
        });
    },[])
    useEffect(() => {
        console.log("detectModel : ", detectModel);
    }, [detectModel]); // detectModel이 변경될 때마다 실행

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
    
                                <div className="App">
                                    <h1>방 접속 페이지</h1>
                                    <>
                                        <button id="penaltyButton" onClick={beolFiltert}>벌칙 시작</button> 
                                        <button onClick={getPlayersInfo}>금칙어 설정 완료</button>
                                        <button onClick={disconnectFromRoom}>방 나가기</button>
                                        <button id="startButton">음성인식시작</button>
                                        <button id="stopButton" disabled>음석 인식 종료</button>
                                        <button id="bulchikonCanvas" onClick={beol(username)}>벌칙</button>
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
            <Footer username={username} roomcode={roomcode} />
        </>
    );
};

export default GameRoomPage;