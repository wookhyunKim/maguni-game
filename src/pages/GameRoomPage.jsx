import { joinSession } from '../../openvidu/app_openvidu.js';
import '../styles/gameroompage.css'
import StatusBar from '../components/layout/StatusBar.jsx';
import Footer from '../components/layout/Footer.jsx';
import useRoomStore from '../components/store/roomStore.js';
import usePlayerStore  from '../components/store/players.js';

const GameRoomPage = () => {

    //store 상태관리

    //username을 usePlayerStore에서 가져옴
    const username = usePlayerStore(state=>state.username)
    //roomcode를 useRoomStore에서 가져옴
    const roomcode = useRoomStore(state=>state.roomcode)
    //players를 usePlayerStore에서 가져옴
    const players = usePlayerStore(state=>state.players)

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
                        <p></p><div className="webcam-container" style={{ position: 'relative', height: videoSize.height, width: videoSize.width }}>
                            <div style={{ position: 'absolute', top: 0, left: 0 }}>
                                <video id = "myVideo" autoPlay playsInline width={videoSize.width} height={videoSize.height}></video>

                            </div>
                            <div style={{ position: 'absolute', top: 0, left: 0 }}>
                                <canvas ref={canvasRef} width={videoSize.width} height={videoSize.height} className="filter-canvas"></canvas>

                            </div>
                        </div>
                        <p className="status">{status}</p>

                        <div style={{ margin: '10px' }}>
                            <button onClick={startFiltering}>필터 시작</button>
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
                                {players.map((player, index) => (
                                    <div className="user-wordlist" key={index}>
                                    <span>{player.nickname}</span>
                                    <div>{player.words[0]}</div>
                                </div> 
                                ))}
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