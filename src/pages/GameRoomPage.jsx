import { useEffect, useState } from 'react'
import io from 'socket.io-client';
import '../styles/gameroompage.css'
import StatusBar from '../components/layout/StatusBar.jsx';
import ForbiddenWordlistModal from '../components/modals/forbiddenWordlistModal.jsx';
import GoongYeForbiddenWordModal from '../components/modals/goongYeForbiddenwordModal.jsx';
import GoongYeAnouncingEndModal from '../components/modals/goongYeAnouncingEndModal.jsx';
import GoongYeAnouncingGameEndModal from '../components/modals/GoongYeAnouncingGameEndModal.jsx';
import Footer from '../components/layout/Footer.jsx';
import useRoomStore from '../components/store/roomStore.js';
import { usePlayerStore } from '../components/store/playerStore.js';
import { useModalStore } from '../components/store/modalStore.js';
import IMG from "../../src/assets/images/dish.png"
import axios from 'axios';
import { useStoreTime } from '../components/store/gameInfoStore.js';
import { calculateFilterPosition } from "../../filter/calculate-filter-position.ts";
import SUNGLASS from "../assets/images/sunglasses.png";
import MUSTACHE from "../assets/images/mustache.png";
import BALD from "../assets/images/mumuri.png";
import detectModelStore from '../components/store/faceDetectModel.js';
import { joinSession } from '../../openvidu/app_openvidu.js';

const GameRoomPage = () => {
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

    //소켓에서 받아온 금칙어 횟수 리스트
    const [finalCountList,setFinalCountList] = useState([]);



    // const [detectModel,setDetectModel] = useState();
    const detectModel = detectModelStore((state)=>state.detectModel)
    //모달 관련 상태
    const { modals, setModal } = useModalStore();

    //사이드바에 금칙어 보이는 여부
    const [isWordsShown, setIsWordsShown] = useState(false);

    const [timer, setTimer] = useState(20); // 타이머 상태
    const [gameActive, setGameActive] = useState(false); // 게임 활성화 상태

    const handlePenalty = () => {
        // Emit an event that the filter should display for 2 seconds
        const event = new CustomEvent('startPenaltyFilter');
        window.dispatchEvent(event);
    };


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

        // setModal('goongYeForbiddenWord', true);

        // setTimeout(() => {
        //     setModal('goongYeForbiddenWord', false);
        // }, 3000);

        socket.emit('start setting word', roomcode);
    };

    const testPenalty = () => {
        handlePenalty();
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
            setModal('goongYeAnnouncingResult', true);
            setFinalCountList(finalCounts);
            document.getElementById('stopButton').click();
        });

        _socket.on('hit user', (user, occurrences) => {
            console.log("hit: ",occurrences);
  
            for (let i = 0; i < occurrences; i++) {
                handlePenalty();
            }
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

// ====================================================== detect model load ====================================================== 
    useEffect(()=>{
        console.log("detectModel : ", detectModel);
        // loadDetectionModel().then((model) => {
        //     // console.log("model : ", model)
        //     setDetectModel(model);
        // });
    })

    useEffect(() => {
        joinSession(roomcode,username);
        connectToRoom();
    },[roomcode,username])
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
                                        <button id="penaltyTestButton" onClick={testPenalty}>벌칙 테스트</button>
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
            {modals.goongYeAnnouncingResult && (
                <GoongYeAnouncingGameEndModal finalCounts={finalCountList} onClose={() => setModal('goongYeAnnouncingResult', false)} />
            )}
            <Footer username={username} roomcode={roomcode} participantList={participantList} setParticipantList={setParticipantList} />
        </>
    );
}

export default GameRoomPage