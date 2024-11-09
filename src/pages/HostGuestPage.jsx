import axios from 'axios';
import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import useRoomStore from '../components/store/roomStore';
import { UsePlayerStore } from '../components/store/playerStore';
import { io } from "socket.io-client";
import detectModelStore from '../components/store/faceDetectModel';
import { loadDetectionModel } from '../../filter/load-detection-model';
import mainCharacter from '../assets/images/mainImage.png'

import '../styles/HostGuestPage.css'
import '../styles/beforeGameRoom.css'
import Profile from '../components/common/Profile';
import CommonButton from '../components/CommonButton';
import RuleDescriber from '../components/common/RuleDescriber';
import GameLayout from '../components/layout/GameLayout';

const HostGuestPage = () => {
    const navigate = useNavigate();

    const setDetectModel = detectModelStore(state=>state.setDetectModel);

    //toggle 여부 상태 관리
    const [isToggled, setIsToggled] = useState(false);

    //username을 usePlayerStore에서 가져옴
    const username = UsePlayerStore(state=>state.username)
    
    const setUserRole = UsePlayerStore(state=>state.setUserRole)


    //roomcode, setRoomcode를 useRoomStore에서 가져옴
    const roomcode = useRoomStore(state=>state.roomcode)
    const setRoomcode = useRoomStore(state=>state.setRoomcode)

    const [isConnected, setIsConnected] = useState(false);

    const [role, setRole] = useState(null); // 역할 (host 또는 participant)

    const [socket, setSocket] = useState(null);

    const [userList, setUserList] = useState([]);

    const [generatedCode, setGeneratedCode] = useState(''); // 호스트용 코드 표시

    //
    const JAVASCRIPT_KEY = import.meta.env.VITE_APP_JAVASCRIPT_KEY;

    useEffect(()=>{
        window.Kakao.cleanup();
        window.Kakao.init(JAVASCRIPT_KEY);
        window.Kakao.isInitialized();
    },[])
    //

    const Gotogameroompage = () => {
        navigate('/gameroom', { state: { roomcode:  role === 'host' ? generatedCode : roomcode, username: username,isHost:role==='host'?true:false }});
    }


    function connectToChatServer() {
        role==='host' ? createRoom() : joinRoom();
        const _socket = io('https://maguni-game-websocket1.onrender.com', {
        autoConnect: false,
        query: {
            username: username,
            role: role,
            roomnumber: role === 'host' ? generatedCode : roomcode,
        }
        });
        _socket.connect();
        setSocket(_socket);
    }

    function createRoom() {
            return axios({
                method: "POST",
            url: "http://localhost:3001/room/api/v1",
            data: {
                "roomCode": generatedCode,
                "nickname": username,
            },
        }).then((res)=>{
            // console.log(res.data['success'])
        }).catch((err)=>{
            console.log(err)
        })
    }

    function joinRoom() {
        return axios({
            method: "POST",
            url: "http://localhost:3001/member/participant/game/api/v1",
            data: {
                "roomCode": roomcode,
                "nickname": username,
            },
        }).then((res)=>{
            // console.log(res.data['success'])
        }).catch((err)=>{
            console.log(err)
        })
    }


    function disconnectToChatServer() {
        socket?.disconnect();
    }

    function onConnected() {
        setIsConnected(true);
    }

    function onDisconnected() {
        setIsConnected(false);
    }

    function updateUserList(list) {
        setUserList(list);
    }

    useEffect(() => {   //소켓 별 이벤트 리스너
        socket?.on('connect', onConnected); //서버랑 연결이 되면
        socket?.on('disconnect', onDisconnected); //서버로부터 연결이 끊어지면
        socket?.on('send user list', updateUserList);

        return () => {
        socket?.off('connect', onConnected);
        socket?.off('disconnect', onDisconnected);
        };
    }, [socket]);


    // 역할이 변경될 때 코드를 생성하도록 수정
    useEffect(() => {
        if (role === 'host') {
        const code = generateRoomCode();
        setGeneratedCode(code);
        setRoomcode(code);
        }
    }, [role]);

// ====================================================== detect model load ====================================================== 
    useEffect(()=>{
        loadDetectionModel().then((model) => {
            setDetectModel(model);
        });
    },[])

  // generateRoomCode 함수 수정
    function generateRoomCode() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        let code = '';
        for (let i = 0; i < 6; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return code;
    }

    //접속하기 누르면, toggle상태 바뀌고, chatserver에 커넥트 되게 함 
    function connectBtnHandler() {
        connectToChatServer();
        setIsToggled(true);
    }

    function disconnectBtnHandler() {
        disconnectToChatServer();
        window.location.reload();
    }
    /////
    const shareKakao = () => {
        const linkUrl = `https://main.maguni-game.com`;
        if (window.Kakao) {
            window.Kakao.Share.createDefaultButton({
            container: "#kakaotalk-sharing-btn",
            objectType: "feed",
            content: {
                title: "📧 초대장",
                description: `당신은 마구니 게임에 초대되었습니다!\n참여 코드: ${roomcode}`,
                imageUrl:
                mainCharacter,
                link: {
                mobileWebUrl: linkUrl,
                webUrl: linkUrl,
                },
            },
            buttons: [
                {
                title: "입장하기",
                link: {
                    mobileWebUrl: linkUrl,
                    webUrl: linkUrl,
                },
            },
            ],
            });
        }
    };
    
    ///////////////////////////////////////////////////////

  return (

    <GameLayout>
        {!isToggled ? (
            <div className='beforeToggleContainer'>
                <div className="hostGuestBtnContainer">
                    {isConnected ? (
                        <>
                            <button className="commonButton" onClick={disconnectBtnHandler}>접속종료</button>
                        </>
                    ) : (
                        <>
                            {role === 'host' ? (
                                <>
                                    <Profile
                                        role={"HOST"}
                                        btnName={"접속하기"}
                                        setRole={setRole}
                                        withInput={true}
                                        generatedCode={generatedCode}
                                        generateRoomCode={generateRoomCode}
                                        connectBtnHandler={connectBtnHandler}
                                    />
                                </>
                            ) : role === 'participant' ? (
                                <>
                                    <Profile
                                        role={"GUEST"}
                                        btnName={"코드 입력"}
                                        setRole={setRole}
                                        withInput={true}
                                        connectBtnHandler={connectBtnHandler}
                                        roomcode={roomcode}
                                        setRoomcode={setRoomcode}
                                    />
                                </>
                            ) : (
                                <div className='hostGuestProfileContainer'>
                                    <div className='hostProfile'>
                                        <Profile
                                            role={"HOST"}
                                            btnName={"방 만들기"}
                                            setRole={setRole}
                                            withInput={false}
                                        />
                                    </div>
                                    <div className='guestProfile'>
                                        <Profile
                                            role={"GUEST"}
                                            btnName={"코드 입력"}
                                            setRole={setRole}
                                            withInput={false}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        ) : (
            <div className="afterToggleContainer">
                <div className="connectedUserList">
                    <Profile 
                        role={"HOST"}
                        btnName={``}
                        setRole={setRole}
                      />
                    </div>

                    <div className="startGameSection">
                        <button id="kakaotalk-sharing-btn" onClick={shareKakao} className='commonButton'>
                            <div>{roomcode}</div>
                            <img
                                src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
                                alt="카카오톡 공유 보내기 버튼"
                                // style={{ width: "50px", cursor: "pointer" }}
                                />
                        </button>
                        <div className='gameControlSection'>
                        {console.log("Current role:", role)}
                            {role === "host" &&
                            (<>
                              <CommonButton 
                                className="startGameBtn commonButton" 
                                onClick={Gotogameroompage} 
                                text="시작하기"
                            />
                            <RuleDescriber />
                            </>
                            )}

                            {role === "participant" &&
                            (<>
                              <CommonButton 
                                className="startGameBtn commonButton" 
                                text="대기중..."
                            />
                            <RuleDescriber />
                            </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </GameLayout>

 );
};


export default HostGuestPage
