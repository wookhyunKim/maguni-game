import PropTypes from 'prop-types';
import '../../styles/modals.css';
import { useEffect, useState } from 'react';
import Goon from "../../assets/images/goongYeBGremoved.webp"
import { scriptData } from '../../assets/utils/gameScripts.js';

// 이미지 미리 로딩
const preloadImage = new Image();
preloadImage.src = Goon;

const GoongYeAnouncingEndModal = ({onClose}) => {
    const { goongYeAnouncingEnd } = useGameStageStore();
    const [currentScript, setCurrentScript] = useState('');

    useEffect(() => {
        const img = new Image();
        img.src = Goon;
    }, []);
    
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * scriptData.goongYeAnouncingEnd.length);
        setCurrentScript(scriptData.goongYeAnouncingEnd[randomIndex]);

        // 타이머는 이미지 로딩 상태와 관계없이 즉시 시작
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // 직접 5000ms 지정

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="goongye-modal-overlay">
            <div className="goongye-modal-content">
                <img 
                    src={Goon} 
                    alt="궁예"
                />
                <h2>게임 종료</h2>
                <p>{currentScript}</p>
            </div>
        </div>
    );
};

GoongYeAnouncingEndModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default GoongYeAnouncingEndModal;
