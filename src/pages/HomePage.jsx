import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/beforeGameRoom.css'
import CommonButton from '../components/CommonButton'
import mainCharacter from '../assets/images/mainCharacterColored.png'
import GameLayout from '../components/layout/GameLayout.jsx';

const HomePage = () => {
    const navigate = useNavigate();
    const [isExiting, setIsExiting] = useState(false);

    const goToNickname = () => {
        setIsExiting(true);
        setTimeout(() => {
            navigate('/nickname');
        }, 500);
    }

    return (
        <GameLayout>
            <div className={`game-content ${isExiting ? 'page-exit-active' : ''}`}>
                <div className="character-container">
                    <img src={mainCharacter} alt="mainCharacter" className="main-character"/>
                </div>
                <CommonButton text="시작하기" onClick={goToNickname} size="large"/>
            </div>
        </GameLayout>
    )
}

export default HomePage
