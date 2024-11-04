import { useEffect, useState } from 'react'
import io from 'socket.io-client';
import '../styles/gameroompage.css'
import StatusBar from '../components/layout/StatusBar.jsx';
import ForbiddenWordlistModal from '../components/modals/forbiddenWordlistModal.jsx';
import GoongYeForbiddenWordModal from '../components/modals/goongYeForbiddenwordModal.jsx';
import GoongYeAnouncingEndModal from '../components/modals/goongYeAnouncingEndModal.jsx';
import Footer from '../components/layout/Footer.jsx';
import useRoomStore from '../components/store/roomStore.js';
import { usePlayerStore } from '../components/store/playerStore.js';
import { useModalStore } from '../components/store/modalStore.js';
import IMG from "../../src/assets/images/dish.png"
import axios from 'axios';
import { useStoreTime } from '../components/store/gameInfoStore.js';
import Goon from "../assets/images/goongYeImage.png";
import { OpenVidu } from "openvidu-browser";
import { calculateFilterPosition } from "../../filter/calculate-filter-position.ts";
import SUNGLASS from "../assets/images/sunglasses.png";
import MUSTACHE from "../assets/images/mustache.png";
import BALD from "../assets/images/mumuri.png";
import detectModelStore from '../components/store/faceDetectModel.js';
import Timer from '../components/common/FullTimerClock.jsx';

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
    // const [detectModel,setDetectModel] = useState();
    const detectModel = detectModelStore((state)=>state.detectModel)
    const FRAME_RATE = 30;
    const APPLICATION_SERVER_URL = "https://mmyopenvidu.onrender.com/";
    //모달 관련 상태
    const { modals, setModal } = useModalStore();

    //사이드바에 금칙어 보이는 여부
    const [isWordsShown, setIsWordsShown] = useState(false);

    const [timer, setTimer] = useState(20); // 타이머 상태
    const [gameActive, setGameActive] = useState(false); // 게임 활성화 상태

    
    
    const [videoRef,setVideoRef] = useState(undefined);

    const globalTime = useStoreTime((state) => state.time);
    const decrementTime = useStoreTime((state) => state.decrementTime);

    // 타이머 로직
    useEffect(() => {
        // 시간이 0이 되면 타이머 종료
        if (globalTime === 0) {
            setModal('goongYeAnouncingEnd', true); // 모달 표시
            return;
        }

        // 1초마다 시간 감소
        const timer = setInterval(() => {
            // 모달이 열려있지 않을 때만 시간 감소
            decrementTime();
        }, 1000);

        // 컴포넌트 언마운트 시 타이머 정리
        return () => clearInterval(timer);
    }, [globalTime, decrementTime]);

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
    };

    function startGame() {
        socket.emit('start game', roomcode); // 게임 시작 요청
        setGameActive(true);
        setTimer(20); // 타이머 초기화
        document.getElementById('startButton').click();
    }
    //===========================금칙어 안내 모달 창 띄우기===========================
    const forbiddenwordAnouncement = async () => {
        try {
            // 먼저 플레이어 리스트 가져오기
            await getPlayersInfo();
            // 데이터를 가져온 후 모달 창 띄우기
            setModal('FW', true);

            // Promise를 사용하여 타이머 완료를 기다림
            await new Promise(resolve => {
                setTimeout(() => {
                    setModal('FW', false);
                    resolve(); // 타이머 완료 후 Promise 해결
                }, 5000);
            });

            // 모달이 완전히 닫힌 후에 사이드바에 금칙어 표시
            setIsWordsShown(true);

            // 금칙어 안내가 끝난 후 1초 뒤에 자동으로 게임 시작
            setTimeout(() => {
                // socket.emit('start game', roomcode); // 게임 시작 요청
                // setGameActive(true);
                // setTimer(20); // 타이머 초기화
                document.getElementById('startgame').click();
            }, 1000);

        } catch (error) {
            console.error('금칙어 안내 모달 창 띄우기 오류:', error);
        }
    };

    //===========================금칙어 설정하기---> 5초 안내 후 20초 설정단계 ===========================
    const startSettingForbiddenWord = () => {

            socket.on('hit user', (user, occurrences) => {
                console.log(occurrences);
                // if(user == username) {
                //      return;
                // }

                const penaltyFunctions = [
                    () => penaltySunglasses(videoRef,user), 
                    () => penaltyMustache(videoRef,user), 
                    () =>penaltyExpansion(videoRef,user), 
                    () => penaltyBald(videoRef,user),beol];

                    
                for (let i = 0; i < occurrences; i++) {
                    setTimeout(() => {
                        console.log('click');
                        const randomFunction = penaltyFunctions[Math.floor(Math.random() * penaltyFunctions.length)];
                        randomFunction();
                    }, i * 300); // 각 호출 사이에 300ms의 간격을 둡니다
                }
            });

        // setModal('goongYeForbiddenWord', true);

        // setTimeout(() => {
        //     setModal('goongYeForbiddenWord', false);
        // }, 3000);

        socket.emit('start setting word', roomcode);
    };



// ====================================================== 캔버스에 그리기 ====================================================== 
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
        canvas.width = Old.width;    // 픽셀 단위 캔버스 너비
        canvas.height = Old.height;  // 픽셀 단위 캔버스 높이
    
        // CSS 스타일 크기를 Old와 동일하게 설정
        canvas.style.width = `${Old.width}px`;
        canvas.style.height = `${Old.height}px`;
        canvas.style.position = "absolute";
    
        // Old의 위치를 기반으로 top, left 설정
        const rect = Old.getBoundingClientRect();
        canvas.style.top = `${rect.top}px`;
        canvas.style.left = `${rect.left}px`;
        canvas.style.zIndex = "10";
    
        // 부모 요소에 canvas 추가
        Old.parentNode.insertBefore(canvas, Old.nextSibling);
    
        const img = new Image();
        img.src = IMG; // 이미지 소스 설정
    
        const IMG_WIDTH = 200;
        const IMG_HEIGHT = 120;
        let yPosition = -IMG_HEIGHT; // 시작 위치는 캔버스 위쪽 바깥
        const targetY = canvas.height / 2 - IMG_HEIGHT / 2; // 목표 위치 (중앙)
    
        const ctx = canvas.getContext("2d");
    
        img.onload = () => {
            // 애니메이션 함수 정의
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 초기화
    
                // 현재 위치에 이미지 그리기
                ctx.drawImage(img, canvas.width / 2 - 200, yPosition -200, IMG_WIDTH, IMG_HEIGHT); // 수평 중앙 정렬
    
                // 목표 위치까지 이동
                if (yPosition < targetY) {
                    yPosition += 5; // 속도 조절 (숫자가 커질수록 빨라짐)
                    requestAnimationFrame(animate); // 다음 프레임 요청
                } else {
                    // 목표에 도달하면 멈춤
                    setTimeout(() => {
                        canvas.remove(); // 3초 후에 캔버스 제거
                    }, 1500);
                }
            }
    
            animate(); // 애니메이션 시작
        };
    }
    
    

// ====================================================== Join ====================================================== 
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
                appendCanvas(event.element, subscriber.stream.connection)
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


    
    function removeUserData(connection) {
        let dataNode = document.getElementById("data-" + connection.connectionId);
        dataNode.parentNode.removeChild(dataNode);
    }
    
    function removeAllUserData() {
        let nicknameElements = document.getElementsByClassName("data-node");
        while (nicknameElements[0]) {
            nicknameElements[0].parentNode.removeChild(nicknameElements[0]);
        }
    }
    
    function appendCanvas(videoElement, connection) {
        let userData;
        if (typeof connection === "string") {
           userData = connection;
        } else {
           userData = JSON.parse(connection.data).clientData;
        }
      
        // 공통 부모 요소를 생성합니다.
        const container = document.createElement('div');
        container.style.position = "relative";
        container.style.width = 640;
        container.style.height = 480;
     
        // 기존 비디오 요소를 부모 요소로 이동합니다.
        videoElement.parentNode.insertBefore(container, videoElement);
        container.appendChild(videoElement);
     
        const canvas = document.createElement('canvas');
        canvas.className = "canvas";
        canvas.id = "canvas_" + userData;
        canvas.width = 640;
        canvas.height = 480;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '1';
     
        container.appendChild(canvas);
     }
     
    
// ====================================================== OPENVIDU API ====================================================== 
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
// ====================================================== 비디오 스트림 ====================================================== 

    const startStreaming = async ( mediaStream) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
    
        const video = document.createElement("video");
        video.srcObject = mediaStream;
        video.autoplay = false;
        video.muted =true;
        video.playsInline = true;
    
        const compositeCanvas = document.createElement("canvas");
        compositeCanvas.style.position = "relative";
        compositeCanvas.width = 640;
        compositeCanvas.height = 480;
        compositeCanvas.id = `canvas_${username}`;
        const ctx = compositeCanvas.getContext("2d");
        
        // videoRef 설정 및 대기
        setVideoRef(video);
    
        // 비디오 메타데이터 로드 시 실행
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                videoStreamStart(video,ctx,compositeCanvas);
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

    const videoStreamStart = (video,ctx,compositeCanvas) => {
        if(!detectModel) return;

        let animationFrameID;
            const estimateFacesLoop = () => {
                    ctx.clearRect(
                        0,
                        0,
                        compositeCanvas.width,
                        compositeCanvas.height
                    );
                    ctx.save();
                    ctx.scale(-1, 1); // X축 반전
                    ctx.translate(-compositeCanvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                    ctx.drawImage(
                        video,
                        0,
                        0,
                        compositeCanvas.width,
                        compositeCanvas.height
                    );

                    ctx.restore();
                    requestAnimationFrame(estimateFacesLoop);

            };
            requestAnimationFrame(estimateFacesLoop);

        return () => {
            if (animationFrameID) {
                cancelAnimationFrame(animationFrameID);
            }
        };
    };
// ====================================================== 선글라스 벌칙 ====================================================== 
 const penaltySunglasses = (videoElement,user)=>{
        if(!detectModel) {
            console.log("detect model is not loaded")
            return};

            const originCanvas = document.getElementById(`canvas_${user}`);

            // const canvas = document.createElement("canvas");
            // // 크기를 originCanvas와 동일하게 설정
            // canvas.width = originCanvas.offsetWidth; 
            // canvas.height = originCanvas.offsetHeight; 
            // canvas.style.position = "absolute";
            // canvas.style.top = originCanvas.offsetTop + "px";
            // canvas.style.left = originCanvas.offsetLeft + "px";
            // canvas.style.zIndex = "10";
            // const ctx = canvas.getContext("2d");

            const canvas = document.createElement("canvas");
            canvas.width = originCanvas.width;    // 픽셀 단위 캔버스 너비
            canvas.height = originCanvas.height;  // 픽셀 단위 캔버스 높이
        
            // CSS 스타일 크기를 Old와 동일하게 설정
            canvas.style.width = `${originCanvas.width}px`;
            canvas.style.height = `${originCanvas.height}px`;
            canvas.style.position = "absolute";
        
            // Old의 위치를 기반으로 top, left 설정
            const rect = originCanvas.getBoundingClientRect();
            canvas.style.top = `${rect.top}px`;
            canvas.style.left = `${rect.left}px`;
            canvas.style.zIndex = "10";
            const ctx = canvas.getContext("2d");
            
            originCanvas.parentNode.insertBefore(canvas, originCanvas.nextSibling);


            const image = new Image();
            image.src = SUNGLASS;



            const drawing=()=>{
                detectModel.estimateFaces(canvas).then((faces) => {
                    ctx.clearRect(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );
                    ctx.save();
                    ctx.scale(-1, 1); // X축 반전
                    ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                    ctx.drawImage(
                        videoElement,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    if (faces[0]) {
                        const { x, y, width, height,angle } = calculateFilterPosition(
                            "eyeFilter",
                            faces[0].keypoints
                        );
                        ctx.scale(-1, 1); // X축 반전
                        ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                        ctx.save(); // 현재 캔버스 상태 저장
                        ctx.translate(x + width / 2, y + height / 2); // 필터 중심으로 이동
                        ctx.rotate(angle); // 얼굴 각도에 맞춰 회전
                        ctx.drawImage(image, -width / 2, -height / 2, width, height); // 중심을 기준으로 이미지 그리기
                        ctx.restore(); // 원래 캔버스 상태로 복원
                    }
                    ctx.restore();
                    requestAnimationFrame(drawing);
                })
            }
            // ctx.restore();
            requestAnimationFrame(drawing);
            setTimeout(() => {
                canvas.remove(); 
            }, 3000);

    }
 const penaltyMustache = (videoElement,user)=>{
        if(!detectModel) {
            console.log("detect model is not loaded")
            return};

            const originCanvas = document.getElementById(`canvas_${user}`);
            const canvas = document.createElement("canvas");
            canvas.width = originCanvas.width;    // 픽셀 단위 캔버스 너비
            canvas.height = originCanvas.height;  // 픽셀 단위 캔버스 높이
        
            // CSS 스타일 크기를 Old와 동일하게 설정
            canvas.style.width = `${originCanvas.width}px`;
            canvas.style.height = `${originCanvas.height}px`;
            canvas.style.position = "absolute";
        
            // Old의 위치를 기반으로 top, left 설정
            const rect = originCanvas.getBoundingClientRect();
            canvas.style.top = `${rect.top}px`;
            canvas.style.left = `${rect.left}px`;
            canvas.style.zIndex = "10";
            const ctx = canvas.getContext("2d");
            
            originCanvas.parentNode.insertBefore(canvas, originCanvas.nextSibling);


            const image = new Image();
            image.src = MUSTACHE;



            const drawing=()=>{
                detectModel.estimateFaces(canvas).then((faces) => {
                    ctx.clearRect(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );
                    ctx.save();
                    ctx.scale(-1, 1); // X축 반전
                    ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                    ctx.drawImage(
                        videoElement,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    if (faces[0]) {
                        const { x, y, width, height,angle } = calculateFilterPosition(
                            "mustacheFilter",
                            faces[0].keypoints
                        );
                        ctx.scale(-1, 1); // X축 반전
                        ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                        ctx.save(); // 현재 캔버스 상태 저장
                        ctx.translate(x + width / 2, y + height / 2); // 필터 중심으로 이동
                        ctx.rotate(angle); // 얼굴 각도에 맞춰 회전
                        ctx.drawImage(image, -width / 2 - 45, -height / 2, width, height); // 중심을 기준으로 이미지 그리기
                        ctx.restore(); // 원래 캔버스 상태로 복원
                    }
                    ctx.restore();
                    requestAnimationFrame(drawing);
                })
            }
            requestAnimationFrame(drawing);
            setTimeout(() => {
                canvas.remove(); 
            }, 3000);

    }
 const penaltyExpansion = (videoElement,user)=>{
        if(!detectModel) {
            console.log("detect model is not loaded")
            return};

            const originCanvas = document.getElementById(`canvas_${user}`);
            const canvas = document.createElement("canvas");
            canvas.width = originCanvas.width;    // 픽셀 단위 캔버스 너비
            canvas.height = originCanvas.height;  // 픽셀 단위 캔버스 높이
        
            // CSS 스타일 크기를 Old와 동일하게 설정
            canvas.style.width = `${originCanvas.width}px`;
            canvas.style.height = `${originCanvas.height}px`;
            canvas.style.position = "absolute";
        
            // Old의 위치를 기반으로 top, left 설정
            const rect = originCanvas.getBoundingClientRect();
            canvas.style.top = `${rect.top}px`;
            canvas.style.left = `${rect.left}px`;
            canvas.style.zIndex = "10";
            const ctx = canvas.getContext("2d");
            
            originCanvas.parentNode.insertBefore(canvas, originCanvas.nextSibling);

            const drawing=()=>{
                detectModel.estimateFaces(canvas).then((faces) => {
                    ctx.clearRect(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );
                    ctx.save();
                    ctx.scale(-1, 1); // X축 반전
                    ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                    ctx.drawImage(
                        videoElement,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    if (faces[0]) {
                        const { x, y, width, height } = calculateFilterPosition(
                            "lefteyeFilter",
                            faces[0].keypoints
                        );
                        ctx.scale(-1, 1); // X축 반전
                        ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                        ctx.drawImage(canvas, x+10, y, width, height, x-30, y, width * 3, height * 3);
                    }
                    ctx.restore();
                    requestAnimationFrame(drawing);
                })
            }
            requestAnimationFrame(drawing);
            setTimeout(() => {
                canvas.remove(); 
            }, 3000);
    }

    const penaltyBald = (videoElement,user)=>{
        if(!detectModel) {
            console.log("detect model is not loaded")
            return};

            const originCanvas = document.getElementById(`canvas_${user}`);
            const canvas = document.createElement("canvas");
            canvas.width = originCanvas.width;    // 픽셀 단위 캔버스 너비
            canvas.height = originCanvas.height;  // 픽셀 단위 캔버스 높이
        
            // CSS 스타일 크기를 Old와 동일하게 설정
            canvas.style.width = `${originCanvas.width}px`;
            canvas.style.height = `${originCanvas.height}px`;
            canvas.style.position = "absolute";
        
            // Old의 위치를 기반으로 top, left 설정
            const rect = originCanvas.getBoundingClientRect();
            canvas.style.top = `${rect.top}px`;
            canvas.style.left = `${rect.left}px`;
            canvas.style.zIndex = "10";
            const ctx = canvas.getContext("2d");
            
            originCanvas.parentNode.insertBefore(canvas, originCanvas.nextSibling);


            const image = new Image();
            image.src = BALD;



            const drawing=()=>{
                detectModel.estimateFaces(canvas).then((faces) => {
                    ctx.clearRect(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );
                    ctx.save();
                    ctx.scale(-1, 1); // X축 반전
                    ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                    ctx.drawImage(
                        videoElement,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    if (faces[0]) {
                        const { x, y, width, height } = calculateFilterPosition(
                            "baldFilter",
                            faces[0].keypoints
                        );
                        ctx.scale(-1, 1); // X축 반전
                        ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                        ctx.drawImage(image, x, y, width, height);
                    }
                    ctx.restore();
                    requestAnimationFrame(drawing);
                })
            }
            requestAnimationFrame(drawing);
            setTimeout(() => {
                canvas.remove(); 
            }, 3000);

    }
// ====================================================== 게임 소켓 서버 API ====================================================== 
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

        // 타이머 업데이트
        _socket.on('timer update', (time) => {
            setTimer(time);
        });
        // 게임 종료 처리
        _socket.on('game ended', (finalCounts) => {
            console.log(finalCounts);
            setGameActive(false);
            console.log('게임이 종료되었습니다. 최종 결과:', finalCounts);
            alert(`게임이 종료되었습니다. 최종 결과: ${JSON.stringify(finalCounts)}`);
            document.getElementById('stopButton').click();
        });

        _socket.on('setting word ended', () => {
            console.log('금칙어 설정이 끝났습니다.');
            forbiddenwordAnouncement();
        });
    
        _socket.on('open modal', () => {
            setModal('goongYeForbiddenWord', true);

            setTimeout(() => {
                setModal('goongYeForbiddenWord', false);
            }, 4000);
        });

    }



    const handleForbiddenWordUsed = (occurrences) => {
        socket.emit('forbidden word used', username, occurrences);
    };
 
    const clickbeol = () => {
        beol(username)    
    };

    useEffect(() => {
        // 타이머 기능
        if (gameActive && timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(countdown);
        } else if (timer === 0) {
            socket.emit('end game', roomcode); // 타이머가 끝나면 게임 종료 요청
        }
    }, [gameActive, timer]);



    // =========================== 방나가기 ========================
    // function disconnectFromRoom() {
    //     socket?.disconnect();
    //     setParticipantList([]);
    //     setForbiddenWordCount({});
    // }


// ====================================================== detect model load ====================================================== 
    useEffect(()=>{
        console.log("detectModel : ", detectModel);
        // loadDetectionModel().then((model) => {
        //     // console.log("model : ", model)
        //     setDetectModel(model);
        // });
    })
// ====================================================== 음성인식 ====================================================== 
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
            // startButton.disabled = false;
            // stopButton.disabled = true;
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
    }, [forbiddenWordlist, isStoppedManually, username, socket]);
// ====================================================== return ====================================================== 
    return (
        <>
            <StatusBar username={username} />
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

                                    <>

                                        <button onClick={startSettingForbiddenWord}>금칙어 설정하기</button>
                                        {/* <button onClick={disconnectFromRoom}>방 나가기</button> */}
                                        <button id="startButton" style={{ display: 'none' }}>음성인식시작</button>
                                        <button id="stopButton" style={{ display: 'none' }} disabled>음성 인식 종료</button>
                                        <button id="startgame" onClick={startGame} style={{ display: 'none' }} disabled={gameActive}>게임 시작</button>
                                        <div>
                                            남은 시간: {timer}초
                                        </div>
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
                                                {isWordsShown && participantList.map(user => (
                                                    <li key={user}>
                                                        {user} - {forbiddenWordlist.find(e => e.nickname === user)?.words || '금칙어 없음'}
                                                        - 금칙어 카운트: {forbiddenWordCount[user] || 0}
                                                    </li>
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
            {modals.FW && (
                <ForbiddenWordlistModal
                    participantList={participantList}
                    forbiddenWordlist={forbiddenWordlist}
                    onClose={() => setModal('FW', false)}
                />)}
            {modals.goongYeForbiddenWord && (
                <GoongYeForbiddenWordModal
                    onClose={() => setModal('goongYeForbiddenWord', false)}
                />
            )}
            {modals.goongYeAnouncingEnd && (
                <GoongYeAnouncingEndModal onClose={() => setModal('goongYeAnouncingEnd', false)} />
            )}
            <Footer username={username} roomcode={roomcode} participantList={participantList} setParticipantList={setParticipantList} />
        </>
    );
}

export default GameRoomPage