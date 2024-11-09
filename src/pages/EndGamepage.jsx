import { useLocation,useNavigate } from 'react-router-dom';
import '../styles/endGame.css'
import WallImage from '../assets/images/endPage_bgImage.webp'
import MontageConatainer from '../components/common/montageConatainer';
import MontageImage from '../assets/images/montage'
import { useEffect, useContext, useState } from 'react';
import ENDINGBGM from "../assets/bgm/endbgm.mp3";
import { Context } from '../../IntroMusicContainer';
import axios from 'axios';
import { UsePlayerStore } from '../components/store/playerStore';
import '../styles/failStampAni.css'
import '../styles/successStampAni.css'

const EndGamepage = () => {
    const [showModal, setShowModal] = useState(true);
    const [timeLeft, setTimeLeft] = useState(20);
    const username = UsePlayerStore((state) => state.username);

    const location = useLocation();
    const navigate = useNavigate();
    const { result, words, roomCode } = location.state || {};
    const { setIsPlay } = useContext(Context);
    const [animationResult, setAnimationResult] = useState({});

    //추억 남기기 버튼 눌렀을 때, 다른 페이지로 이동함
    const gotoFourcut = ()=>{
        navigate('/fourcut',{state : {roomCode:roomCode}})
    }

    //montage 파일에서 랜덤으로 이미지 가져오기
    const getRandomMontage = ()=>{
      const randomIndex = Math.floor(Math.random() * MontageImage.length);
        return MontageImage[randomIndex];
    }

    //랜덤으로 선택한 하나의 이미지
    const randomMontage = getRandomMontage();


    const checkAnswer = () => {
        const inputValue = document.getElementById('input-forbiddenWord').value;
        if (!inputValue.trim()) return;  // 빈 입력값 체크
        
        return axios({
            method: 'POST',
            url: 'http://localhost:3001/member/game/api/v1',
            data: {
                roomCode: roomCode,
                nickname: username,
                word: inputValue,
            },
        })
        .then((res) => {
            console.log(res.data["success"]);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const getResults = () => {
        return axios({
            method: 'GET',
            url: `http://localhost:3001/member/game/api/v1/${roomCode}`,
        })
            .then((res) => {
                console.log("end game  result : ", res.data)
                setAnimationResult(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        };


    //유저별로 금칙어 단어, 그리고 위반 횟수 표시
    const displayResults = () => {
        if (!result || !words) return "데이터 없음";
        
        return words.map(userInfo => {
            const nickname = userInfo.nickname;
            const forbiddenWord = userInfo.words[0];
            const violationCount = result[nickname] || 0;
            
            // 스탬프 애니메이션을 위한 클래스 추가
            const stampClass = !showModal && animationResult[nickname] 
                ? 'stamp-container success-animation'
                : 'stamp-container fail-animation';

            return (
                <MontageConatainer 
                    key={nickname} 
                    className={`user-result ${!showModal ? stampClass : ''}`}
                >
                    <>
                        <div className="hanji-text">
                            <div className="stamp-container"></div>
                            <p className="hanji-forbiddenWord">금칙어: {forbiddenWord}</p>
                            <p className="hanji-count">위반횟수: {violationCount}회</p>
                        </div>
                        <div className="hanji-img-container">
                            <img className="one-montage" src={randomMontage} alt="montage"/>
                        </div>
                        <div className="hanji-username">
                            <p>{nickname}</p>
                        </div>
                    </>
                </MontageConatainer>
            );
        });
    };

    const playMusic = () => {
        const audio = document.getElementById('bgm');
        if (audio) {
            audio.muted = false; 
            audio.play().catch((error) => {
                console.log("재생 오류:", error);
            });
        }
    }
    useEffect(() => {
        // IntroMusicContainer의 음악을 확실히 중지
        setIsPlay(false);
        // EndGamePage의 BGM 재생
        playMusic();
    }, [setIsPlay]);

    //모달 띄우는 함수
    // const showModal = () => {
    //     setShowModal(false);
    // }
    
    useEffect(() => {
        // 기존 audio 태그 중지 또는 음소거
        const existingAudio = document.getElementById('bgm');
        if (existingAudio) {
            existingAudio.pause();  // 중지
            existingAudio.muted = true;  // 음소거
        }

    }, []);


    useEffect(() => {
        if(!showModal){
            getResults();
        }
    }, [showModal]);

    // 타이머 효과 추가
    useEffect(() => {
        if (showModal) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setShowModal(false);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [showModal]);

    return (
        <>
            <audio id="bgm" src={ENDINGBGM} loop autoPlay muted></audio>
            <div className="endGame-container">
                <div className="wallImage" style={{backgroundImage: `url(${WallImage})`}}>
                {showModal && (
                <div className="input-modal">
                    <div className="modal-content">
                        <div className="timer">{timeLeft}초</div>
                        <h2 className="modal-title">석방 기회</h2>
                        <input 
                            id="input-forbiddenWord" 
                            type="text" 
                            placeholder="추정되는 자신의 금칙어를 입력해주세요" 
                            autoComplete="off"
                            autoFocus
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    checkAnswer();
                                }
                            }}
                        />
                        <button onClick={checkAnswer}>확인</button>
                    </div>
                </div>
            )}
                <div className="result-container">
                    <div className="result-title">금칙어 위반 역적</div>
                    <div className="hanji-container">
                    {/* 여기안에 한지 몽타주들 옴 */}
                    {displayResults()}
                    </div>
                </div>
                <div className="endPageFooter">
                    {/* <button onClick={gotoPhoto}>추억 남기기</button> */}
                    <button className=" gotofourcutBtn commonButton" onClick={gotoFourcut}>추억 남기기</button>
                </div>
                </div>
            </div>
        </>
    );
};

export default EndGamepage;
