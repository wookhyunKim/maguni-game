import PropTypes from 'prop-types';
import '../../styles/modals.css';
import { useEffect, useState } from 'react';
import useGameStageStore from '../store/gameStage.js';
import Goon from "../../assets/images/goongYeImage.webp"
import { scriptData } from '../../assets/utils/gameScripts.js';

// 이미지 미리 로딩
const preloadImage = new Image();
preloadImage.src = Goon;

const SettingForbiddenWordModal = ({onClose }) => {
    const { goongYeRevealForbiddenWord } = useGameStageStore();
    const [currentScript, setCurrentScript] = useState('');

    useEffect(() => {
        const img = new Image();
        img.src = Goon;
    }, []);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * scriptData.goongYeRule.length);
        setCurrentScript(scriptData.goongYeRule[randomIndex]);

        const timer = setTimeout(() => {
            onClose();
        }, 12000); // 8초로 고정

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* 카운트 하는 애니메이션 추가 예정 */}
                <img 
                    src={Goon} 
                    alt="궁예"
                    style={{ 
                        height: 'auto',
                    }}
                />
                <p>{currentScript}</p>
                <div className="timer">
                    <div 
                        className="progress-bar" 
                        style={{
                            animation: 'progress 12s linear'
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
