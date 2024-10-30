import { useEffect, useRef, useState } from "react";
import { joinSession, leaveSession } from '../../openvidu/app_openvidu.js';
import { useEffect, useState } from 'react'; 
import { useLocation } from 'react-router-dom';
import '../styles/gameroompage.css'
import axios from 'axios';

const GameRoomPage = () => {
    const location = useLocation();
    const username = location.state?.username;
    const roomcode = location.state?.roomcode;
    const isHost = location.state?.isHost;
    console.log(username, roomcode);
    const [getCode,setGetCode] = useState('');


    //상태관리
    const [inputValue, setInputValue] = useState('');

    //
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const insertWord = ()=>{
        return axios({
            method: "POST",
            url: "http://localhost:3001/member/api/v1/word",
            data: {
                "roomCode": roomcode,
                "nickname": username,
                "word": inputValue
            },
        }).then((res)=>{
            console.log(res.data['success'])
            return getWords();
        }).catch((err)=>{
            console.log(err)
        })
    }

    //
    const getWords = ()=>{
        return axios({
            method: "GET",
            url: `http://localhost:3001/member/api/v1/word/${roomcode}/${username}`,
        }).then((res)=>{
            // console.log(res.data[0][0])
            setGetCode(res.data[0][0])
     

            // setGetCode(prevGetCode => [...prevGetCode, 'sk']);
        }).catch((err)=>{
            console.log(err)
        })
    }
    useEffect(() => {
      console.log(getCode)
    }, [getCode]);


    return (
        <>
            <nav className="navbar">
                <div className="navbar-header"></div>
            </nav>

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
                        <input className="btn btn-large btn-danger"
                            type="button"
                            id="buttonLeaveSession"
                            onClick={() => leaveSession()}
                            value="Leave session" />
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
                    <div className="input-group" style={{ margin: '10px 0' }}>
                        <input 
                            type="text"
                            className="form-control"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="메시지를 입력하세요"
                        />
                        <button 
                            className="btn btn-primary"
                            onClick={insertWord}
                            style={{ marginLeft: '5px' }}
                        >
                            전송
                        </button>
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

            <footer className="footer">
            </footer>
        </>
    );
};

export default GameRoomPage;