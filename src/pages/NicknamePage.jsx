import { useNavigate } from 'react-router-dom';
import { UsePlayerStore } from '../components/store/playerStore';
import '../styles/nicknamePageInput.css'
import nextButton from '../assets/images/nextButton.png'
import {nicknames} from "../assets/utils/nicknames.js"
import GameLayout from '../components/layout/GameLayout';
import { useState } from 'react';
import CLICKSOUND from '../assets/bgm/click.mp3';

const NicknamePage = () => {
    const navigate = useNavigate();
    const username = UsePlayerStore(state=>state.username);
    const setUsername = UsePlayerStore(state=>state.setUsername);
    const [isExiting, setIsExiting] = useState(false);
  
    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            const audio = new Audio(CLICKSOUND);
            audio.volume = 0.1;
            audio.play();
            
            setIsExiting(true);
            setTimeout(() => {
                navigate('/hostguest');
            }, 500);
        }
    };

    const createNickName = (e) => {
        e.preventDefault();
        const randomIndex = Math.floor(Math.random() * nicknames.nicknameList.length);
        const nickname = nicknames.nicknameList[randomIndex];
        setUsername(nickname);
    }

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= 10) {
            setUsername(value);
        }
    };
  
    return (
        <GameLayout>
            <div className={`nickname-page ${isExiting ? 'page-exit-active' : ''}`}>
                <form className='nicknameInputContainer' onSubmit={handleSubmit}>
                    <input 
                        className='nicknameInput'
                        type="text"
                        value={username||""}
                        onChange={handleInputChange}
                        placeholder="사용자 이름을 입력하세요 (최대 10글자)"
                        maxLength={10}
                    />
                    <img 
                        src={nextButton} 
                        alt="다음" 
                        onClick={handleSubmit}
                        className='nextButton'
                    />
                </form>
                <div className='nicknameRandomBtnContainer'>
                    <a 
                        className='nicknameRandomBtn' 
                        onClick={createNickName}
                    >
                        랜덤 닉네임 생성하기
                    </a>
                </div>
            </div>
        </GameLayout>
    );
}

export default NicknamePage;



