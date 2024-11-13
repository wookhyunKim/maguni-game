import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../styles/gameroompage.css'

// 레이아웃 import
import StatusBar from '../components/layout/StatusBar.jsx';
import Input from '../components/common/Input.jsx';
import Footer from '../components/layout/Footer.jsx';
import PlayerWordCard from '../components/common/PlayerWordCard.jsx';
// 모달 import
import ForbiddenWordlistModal from '../components/modals/ForbiddenWordlistModal.jsx';
import SettingForbiddenWordModal from '../components/modals/goongYeForbiddenwordModal.jsx';
import GoongYeAnouncingEndModal from '../components/modals/goongYeAnouncingEndModal.jsx';
import GoongYeAnouncingGameEndModal from '../components/modals/GoongYeAnouncingGameEndModal.jsx';
import GoongYeWhoModal from '../components/modals/GoongYeWhoModal.jsx';

// 스토어 import
import useRoomStore from '../components/store/roomStore.js';
import { UsePlayerStore } from '../components/store/playerStore.js';
import { useModalStore } from '../components/store/modalStore.js';

// 오픈비두 관련 import
import { joinSession } from '../../openvidu/app_openvidu.jsx';
import html2canvas from "html2canvas";
import StartSound from '../assets/bgm/game_start.wav'; 
import WHO from '../assets/bgm/gichim.wav'; 
import '../styles/UsernameWordCard.css'
import GameStartSound from '../assets/bgm/start_game_bell.wav'; 
import BombSound from '../assets/bgm/bomb.wav'; 
import SPRING from '../assets/bgm/spring.mp3'; 
import { Context } from '../../IntroMusicContainer';
import { useContext } from 'react';
import UsernameWordCard from '../components/common/UsernameWordCard.jsx';
import ReactDOM from 'react-dom';

const GameRoomPage = () => {
    const navigate = useNavigate();
    //username, roomcode를 가져옴
    const username = UsePlayerStore(state => state.username)
    const roomcode = useRoomStore(state => state.roomcode)
    const playerNumber = UsePlayerStore(state => state.userIndex) + 1;
    const userRole = UsePlayerStore(state => state.userRole)

    const { setIsPlay } = useContext(Context);

    //게임진행 소켓 상태관리
    const [socket, setSocket] = useState(null);
    const [participantList, setParticipantList] = useState([]); 
    const [forbiddenWordCount, setForbiddenWordCount] = useState({});
    const [forbiddenWordlist, setForbiddenWordlist] = useState([]);
    // 음성인식 관련 상태
    const [isStoppedManually, setIsStoppedManually] = useState(false);
    //소켓에서 받아온 금칙어 횟수 리스트
    const [finalCountList, setFinalCountList] = useState([]);
    //모달 관련 상태
    const { modals, setModal } = useModalStore();
    //사이드바에 금칙어 보이는 여부
    const [isWordsShown, setIsWordsShown] = useState(false);

    const [timer, setTimer] = useState(20);
    // 금칙어 설정 후 말하는 시간
    const startTime = 100;
    const [gameActive, setGameActive] = useState(false);

    const hasJoinedSession = useRef(false);

    // Input 컴포넌트 표시 여부 상태
    const [showInput, setShowInput] = useState(false);

    //sidebar 미션 섹션 표시 여부 상태
    const [showMission, setShowMission] = useState(false);

    // 사진용 div
    const divRef = useRef(null);
    const [ablePic,setablePic]= useState(false)

    const handlePenalty = () => {
        const event = new CustomEvent('startPenaltyFilter');
        window.dispatchEvent(event);
    };
    

    function quitGame() {
        navigate('/');
        window.location.reload();
    }

    //==========================input.jsx에서 완료 버튼 클릭 시 호출할 콜백 함수===============
    const handleInputComplete = () => {
        setShowMission(false);
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

    // 금칙어 설정 후 게임 시작하게 하는 함수
    function startGame() {
        // 게임 시작 요청
        socket.emit('start game', roomcode, startTime);
        setGameActive(true);
        setTimer(startTime);
        document.getElementById('startButton').click();
    }
    //===========================금칙어 안내 모달 창 띄우기===========================
    const forbiddenwordAnouncement = async () => {
        try {
            // 먼저 플레이어 리스트 가져오기
            await getPlayersInfo();
            // 데이터를 가져온 후 모달 창 띄우기
            setModal('FW', true);
            setShowInput(false);

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
                document.getElementById('startgame').click();
                //startGame();
            }, 1000);

        } catch (error) {
            console.error('금칙어 안내 모달 창 띄우기 오류:', error);
        }
    };

    //===========================금칙어 설정하기---> 5초 안내 후 20초 설정단계 ===========================
    const startSettingForbiddenWord = () => {
        setShowMission(true); // sidebar_mymission 표시
        socket.emit('start setting word', roomcode);
    };

    const testPenalty = () => {
        handlePenalty();
    }

    // ====================================================== 게임 소켓 서버 API ====================================================== 
    function connectToRoom() {

        const _socket = io('https://maguni-game-websocket2.onrender.com', {
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
            const audio = new Audio(BombSound);
            audio.play();
            setGameActive(false);
            setModal('goongYeAnnouncingResult', true);
            setFinalCountList(finalCounts);
            document.getElementById('stopButton').click();
        });

        _socket.on('setting word ended', () => {
            
            forbiddenwordAnouncement().then(()=>{
                const audio = new Audio(GameStartSound);
                audio.play();
            })
            setShowMission(false);
        });

        // 금칙어 설정 안내 모달 열기
        _socket.on('open instruction modal', async () => {
            setShowMission(true);
            setModal('SettingForbiddenWordModal', true);
            setShowInput(true);
            // 오디오 파일 재생
            const audio = new Audio(StartSound);
            audio.play();

            // 타이머 초기화 (모달이 열릴 때)
            setTimer(20);

            // 모달이 닫히기를 기다림
            await new Promise(resolve => setTimeout(resolve, 12000));
            setModal('SettingForbiddenWordModal', false);
        });

        _socket.on('hit user', (user) => {
            if (user !== username) {
                return;
            }
            handlePenalty();
            let nextIndex;
            if(!ablePic){
                setablePic(true);
                const index = participantList.indexOf(user);
                if (index == participantList.length-1){
                    nextIndex = 0;
                }else{
                    nextIndex = index + 1;
                }

                _socket.emit('do take photo', participantList[nextIndex]);
            }


        _socket.on('sound on',()=>{
            const audio = new Audio(SPRING);
            audio.play();
        })
        


        });

        _socket.on('take a picture', (user) => {
            if (user == username) {
                console.log("사진찍힘")
                sendImage()
            }
        })

        // 타이머 업데이트
        _socket.on('who', async() => {
            // 모달 띄우기 
            const audio = new Audio(WHO);
            // audio.volume = 1.5; // 음량을 20%로 설정
            audio.play();
            setModal('WhoModal',true)
            //모달 끄기 4초후
            // 모달이 닫히기를 기다림
            await new Promise(resolve => setTimeout(resolve, 4000));
            setModal('WhoModal', false);
        });

    }

    const handleForbiddenWordUsedCount = (occurrences) => {
        socket.emit('forbidden word used count', username, occurrences);
    };

    const handleForbiddenWordUsedHit = () => {
        socket.emit('forbidden word used hit', username);
    };

    useEffect(() => {
        // 타이머 기능
        if (gameActive && timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(countdown);
        } else if (timer === 0) {
            socket.emit('end game', roomcode);
        }
    }, [gameActive, timer]);


    useEffect(() => {
        // 금칙어를 각 유저의 비디오 컨테이너에 추가
        participantList
            .filter(user => user !== username)
            .forEach((user) => {
                // video-container 내에서 유저 이름을 클래스명으로 가지는 컨테이너를 찾음
                const userContainer = document.querySelector(`#video-container .${user}`);
                const words = forbiddenWordlist.find(e => e.nickname === user)?.words;
            });
    }, [participantList, forbiddenWordlist]); // `participantList`와 `forbiddenWordlist`가 변경될 때마다 실행

    // ====================================================== take photos ====================================================== 
    const sendImage = () => {
        const date = new Date();
        const nowtime = `${String(date.getHours()).padStart(2, "0")}-${String(date.getMinutes()).padStart(2, "0")}-${String(date.getSeconds()).padStart(2, "0")}`;
        if (divRef.current) {
            html2canvas(divRef.current).then(canvas => {
                const imageData = canvas.toDataURL("image/png");
                // 서버에 이미지 데이터 전송
                axios.post("http://localhost:3001/upload/api/v1",
                    {
                        image: imageData,
                        filename: `${roomcode}_${nowtime}.png`
                    }
                ).then(response => {
                    console.log("Image saved on server:", response.data);
                })
                    .catch(error => {
                        console.error("Error saving image:", error);
                    });
            });
        }
    };

    // ====================================================== detect model load ====================================================== 
    useEffect(() => {
        if (!hasJoinedSession.current) {
            joinSession(roomcode, username);
            connectToRoom();
            hasJoinedSession.current = true;
        }
    }, [])


    // ====================================================== 음성인식 ====================================================== 
    useEffect(() => {
        let recognition = null;

        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.lang = 'ko-KR';
            recognition.continuous = true;
            recognition.interimResults = true;

            const handleStart = () => {
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
                    const word = forbiddenWordlist.find(e => e.nickname === username)?.words;

                    if (result.isFinal) {
                        finalTranscript += transcript + ' ';
                        // 금칙어 카운트 수정

                        if (word) {
                            const occurrences = (transcript.match(new RegExp(word, 'g')) || []).length;
                            if (occurrences > 0) {
                                handleForbiddenWordUsedCount(occurrences);
                            }
                        }
                    } else {
                        interimTranscript += transcript + ' ';

                        if (word) {
                            const occurrences = (transcript.match(new RegExp(word, 'g')) || []).length;
                            if (occurrences > 0) {
                                handleForbiddenWordUsedHit();
                            }
                        }
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

            // Clean up 함수 수정
            return () => {
                if (recognition) {
                    recognition.stop();
                    recognition.onend = null;
                    recognition.onresult = null;
                    recognition.onerror = null;
                    recognition.onstart = null;
                }

                const startButton = document.getElementById('startButton');
                const stopButton = document.getElementById('stopButton');
                if (startButton) startButton.removeEventListener('click', handleStart);
                if (stopButton) stopButton.removeEventListener('click', handleStop);
            };
        } catch (error) {
            console.error('음성 인식 초기화 오류:', error);
        }
    }, [forbiddenWordlist, isStoppedManually, username, socket]);


    // ====================================================== return ====================================================== 
    return (
        <>
            <StatusBar username={username} sessionTime={timer} playerNumber={playerNumber} />
            <div id="main-container" className="container">
                {/* ---------- 대기실 2 ----------*/}
                <div id="join">
                </div>
                {/* ---------- Join - 게임 ----------*/}
                <div id="session" style={{ display: 'none' }}>
                    <div id="session-body">
                        <div className="main-content">
                            <div className="test_button_container">
                                <>
                                    <button id="penaltyTestButton" onClick={testPenalty} style={{ display: 'none' }}>벌칙 테스트</button>
                                    <button id="startButton" style={{ display: 'none' }}>음성인식시작</button>
                                    <button id="stopButton" style={{ display: 'none' }} disabled>음성 인식 종료</button>
                                    <button id="startgame" onClick={startGame} style={{ display: 'none' }} disabled={gameActive}>게임 시작</button>
                                    <div className="time-remained">
                                        남은 시간: {timer}초
                                    </div>
                                </>
                            </div>
                            <div id="video-container" className="col-md-6" ref={divRef}>
                            {isWordsShown && participantList
                                .map((user, index) => {
                                    const words = forbiddenWordlist.find(e => e.nickname === user)?.words;
                                    const isHost = (user === username);
                                    
                                    // 해당 유저의 container가 존재하는지 확인 후, 포털로 추가
                                    const userContainer = document.querySelector(`.${user}`);
                                    
                                    return userContainer ? (
                                        ReactDOM.createPortal(
                                            <UsernameWordCard
                                                key={user}
                                                user={user}
                                                words={words}
                                                isHost={isHost}
                                                playerIndex={index}
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                }}
                                                count={forbiddenWordCount[user]}
                                            />,
                                            userContainer
                                        )
                                    ) : null;
                                })}
                            </div>
                        </div>
                        <div className="gameroom-sidebar">
                            <div className="sidebar_waitingBtn">
                                {userRole === "host" ? (
                                    <button className="startGameButton settingWordsButton" onClick={startSettingForbiddenWord}>게임 시작</button>
                                ) : (
                                    <button className="guestWaitingBtn" disabled>호스트가 게임을 시작하기를 기다리세요</button>
                                )}
                            </div>
                            <div className="sidebar_wordlist">
                                <div className="sidebar_index">금칙어 목록</div>
                                <div className="sidebar_content">
                                    <div className="player-cards-container">
                                        {isWordsShown && participantList
                                            .filter(user => user !== username)
                                            .map((user) => {
                                                // 원래 플레이어의 인덱스 찾기
                                                const originalPlayerIndex = participantList.findIndex(p => p === user);
                                                return (
                                                    <PlayerWordCard
                                                        key={user}
                                                        user={user}
                                                        words={forbiddenWordlist.find(e => e.nickname === user)?.words}
                                                        count={forbiddenWordCount[user]}
                                                        playerIndex={originalPlayerIndex}
                                                    />
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                            <div className={`sidebar_mymission ${showMission ? 'show' : ''}`}>
                                <div className="sidebar_index">나의 미션</div>
                                <div className="sidebar_content">
                                    <div className="footer-input">
                                        <Input
                                            username={username}
                                            roomcode={roomcode}
                                            participantList={participantList}
                                            setParticipantList={setParticipantList}
                                            showInput={showInput}
                                            onComplete={handleInputComplete}
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="sidebar-btn">
                                <input
                                    className="btn btn-large btn-danger"
                                    type="button"
                                    id="buttonLeaveSession"
                                    onClick={quitGame}
                                    value="나가기"
                                />
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
                {modals.SettingForbiddenWordModal && (
                    <SettingForbiddenWordModal
                        onClose={() => setModal('SettingForbiddenWordModal', false)}
                    />
                )}
                {modals.goongYeAnouncingEnd && (
                    <GoongYeAnouncingEndModal onClose={() => {
                        setModal('goongYeAnnouncingEnd', false);
                        setShowInput(false);
                    }} />
                )}
                {modals.WhoModal && (
                    <GoongYeWhoModal onClose={() => {
                        setModal('WhoModal', false);
                    }} />
                )}
                {modals.goongYeAnnouncingResult && (
                    <GoongYeAnouncingGameEndModal
                        finalCounts={finalCountList}
                        onClose={() => {
                            setModal('goongYeAnnouncingResult', false);
                            setTimeout(() => {
                                setIsPlay(false);
                                navigate('/end', {
                                    state: {
                                        result: finalCountList,
                                        words: forbiddenWordlist,
                                        roomCode: roomcode,
                                        username: username
                                    }
                                });
                                window.location.reload();
                            }, 3000);
                        }}
                    />
                )}
                
            </div>
        </>
    );
}

export default GameRoomPage