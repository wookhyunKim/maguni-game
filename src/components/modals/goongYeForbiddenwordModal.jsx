import PropTypes from 'prop-types';
import '../../styles/modals.css';
import { useEffect, useState } from 'react';
import useGameStageStore from '../store/gameStage.js';
import Goon from "../../assets/images/goongYeImage.png"
import { scriptData } from '../../assets/utils/gameScripts.js';

// 이미지 미리 로딩
const preloadImage = new Image();
preloadImage.src = Goon;

const SettingForbiddenWordModal = ({onClose }) => {
    const { goongYeRevealForbiddenWord } = useGameStageStore();
    const [currentScript, setCurrentScript] = useState('');
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * scriptData.goongYeForbiddenWord.length);
        setCurrentScript(scriptData.goongYeForbiddenWord[randomIndex].text);
        console.log("TEST RANDOM SCRIPT");

        // 이미지가 이미 캐시되어 있는지 확인
        if (preloadImage.complete) {
            setIsImageLoaded(true);
        } else {
            preloadImage.onload = () => {
                setIsImageLoaded(true);
            };
        }

        const timer = setTimeout(() => {
            onClose();
        }, 5000); // 5초로 고정

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <img 
                    src={Goon} 
                    alt="궁예"
                    style={{ 
                        maxWidth: '300px',
                        height: 'auto',
                        display: isImageLoaded ? 'block' : 'none'
                    }}
                />
                <h2>금칙어 세팅 5초</h2>
                <p>{currentScript}</p>
                <div className="timer">
                    <div 
                        className="progress-bar" 
                        style={{
                            animation: 'progress 5s linear'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

SettingForbiddenWordModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default SettingForbiddenWordModal;
