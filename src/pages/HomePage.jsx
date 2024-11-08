import { useNavigate } from "react-router-dom";
import '../styles/beforeGameRoom.css'
import CommonButton from '../components/CommonButton'
import mainCharacter from '../assets/images/mainImage.png'
import BEGINBGM from "../assets/bgm/beginbgm.mp3";
import SOUNDON from "../assets/images/SoundOnIcon.png"
import SOUNDOFF from "../assets/images/SoundOffIcon.png"
import { useState } from "react";

const HomePage = () => {
    const navigate = useNavigate();
    const [music, setMusic] = useState(false);

    const  goToNickname = () => {
        navigate('/nickname');
        }

        const playMusic = () => {
            const audio = document.getElementById('bgm');
            setMusic(!music)
            if (!audio) {
                return;
            }
            if (!audio.paused) {
                // 이미 재생 중인 경우 음소거 설정
                audio.muted = !audio.muted; // 음소거/음소거 해제 토글
            } else {
                audio.play().catch(error => {
                    console.log("재생 오류:", error);
                });
            }
        };
        
    

    return (
        <>
            <img 
                src={music?SOUNDOFF:SOUNDON} 
                alt="" 
                onClick={playMusic} 
                style={{ width: '50px', height: '50px', cursor: 'pointer' }} 
            />
            <audio id="bgm" src={BEGINBGM}></audio>
    <div className="beforeGameRoomBody">
        <div className="game-container ">
            <div className="game-content">
                <h1 className='game-title text-center text-5xl text-'>금칙어 게임</h1>
                <div className="character-container">
                    <img src={mainCharacter} alt="mainCharacter" className="main-character"/>
                </div>
                <CommonButton text="시작하기" onClick={goToNickname} size="large"/>
            </div>
        </div>
    </div>
    </>
    )
}

export default HomePage
