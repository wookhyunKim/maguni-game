import { joinSession, leaveSession } from '../../openvidu/app_openvidu.js';
import { useLocation } from 'react-router-dom';
import '../styles/gameroompage.css'
import StatusBar from '../components/layout/StatusBar.jsx';
import Footer from '../components/layout/Footer.jsx';

const GameRoomPage = () => {
    const location = useLocation();
    const username = location.state?.username;
    const roomcode = location.state?.roomcode;
    const isHost = location.state?.isHost;
    console.log(username, roomcode);

    // const [roomcode, setRoomcode] = useState(""); // 빈 문자열로 초기화
    // const [username, setUsername] = useState(""); // 빈 문자열로 초기화
    // // roomcode 업데이트하기
    // const handleRoomcodeChange = (roomcode) => {
    //     setRoomcode(roomcode);
    // };

    // // username 업데이트하기
    // const handleUsernameChange = (username) => {
    //     setUsername(username);
    // };


    return (
        <>
            <nav className="navbar">
                <div className="navbar-header"></div>
            </nav>
            <StatusBar/>
            <div id="main-container" className="container">
                <div id="join">
                    <div id="join-dialog" className="jumbotron vertical-center">
                        <h1>Join a video session</h1>
                        <form className="form-group" onSubmit={(e) => {
                            e.preventDefault();  // 기본 제출 동작 방지
                            joinSession();
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

                <div id="session" style={{ display: 'none' }}>
                    <div id="session-header">
                        <h1 id="session-title"></h1>
                        
                    </div>
                    <div id="main-video" className="col-md-6">
                        <p></p>
                        <video autoPlay playsInline={true}></video>
                        <div style={{ margin: '10px' }}>
                            <button id="startButton">게임 시작</button>
                            <button id="stopButton" disabled>게임 종료</button>
                            <div id="count">금칙어(아니) 카운트: 0</div>
                        </div>
                    </div>
                    <div id="video-container" className="col-md-6">
                    </div>
                    
                    <div className="gameroom-sidebar">
                        <div className="sidebar_wordlist">
                            <div className="sidebar_index">금칙어 목록</div>
                            <div className="sidebar_content">
                                {/* <div className="user-wordlist">
                                    <span>{username}</span>
                                    <div>{getCode}</div>
                                </div> */}
                                {/* {users.map((user) => (
                                    <div className="user-wordlist" key={user.id}>
                                    <span>{username}</span>
                                    <div>{getCode}</div>
                                </div> 
                                ))} */}
                            </div>
                        </div >
                        <div className="sidebar_mymission">
                            <div className="sidebar_index">나의 미션</div>
                            <div className="sidebar_content">sdf</div>
                        </div>
                        <div className="sidebar_goongye">
                            <div className="sidebar_index">진행자</div>
                            <div className="sidebar_content">sdf</div>
                        </div>
                    </div>
                    <div id="subtitles" style={{
                    }}>
                        자막
                    </div>
                </div>
            </div>
            <Footer username={username} roomcode={roomcode}/>
            <footer className="footer">
            </footer>
        </>
    );
};

export default GameRoomPage;