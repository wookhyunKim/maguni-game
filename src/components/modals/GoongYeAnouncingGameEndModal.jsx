import PropTypes from 'prop-types';
import '../../styles/modals.css';
import { useEffect, useState } from 'react';
import useGameStageStore from '../store/gameStage.js';
import Goon from "../../assets/images/goongYeImage.png"
import { scriptData } from '../../assets/utils/gameScripts.js';

var ANNOUNCE_RESULT = 0;
var ANNOUNCE_VICTIM = 1;

// 이미지 미리 로딩
const preloadImage = new Image();
preloadImage.src = Goon;

const GoongYeAnouncingGameEndModal = ({finalCounts={},onClose}) => {
    const [currentScript, setCurrentScript] = useState('');
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        // finalCounts에서 가장 높은 occurrences의 username 찾기
        const highestUser = Object.entries(finalCounts).reduce(
            (max, [username, occurrences]) => occurrences > max.occurrences ? { username, occurrences } : max,
            { username: null, occurrences: -1 }
        );

        let selectedScript = scriptData.goongYeAnnouncingResult[ANNOUNCE_RESULT] + "\n";
        selectedScript += scriptData.goongYeAnnouncingResult[ANNOUNCE_VICTIM].replace("username", highestUser.username);
        setCurrentScript(selectedScript);

        // 이미지가 이미 캐시되어 있는지 확인
        if (preloadImage.complete) {
            setIsImageLoaded(true);
        } else {
            preloadImage.onload = () => {
                setIsImageLoaded(true);
            };
        }

        // 타이머는 이미지 로딩 상태와 관계없이 즉시 시작
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // 직접 5000ms 지정

        return () => clearTimeout(timer);
    }, [finalCounts,onClose]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <img 
                    src={Goon} 
                    alt="궁예"
                    style={{ 
                        maxWidth: '300px',  // 이미지 크기 제한
                        height: 'auto',
                        display: isImageLoaded ? 'block' : 'none'  // 로딩 완료 전까지 숨김
                    }}
                />
                <h2>게임 종료</h2>
                <p>{currentScript}</p>
                <div className="timer">
                    <div className="progress-bar" 
                        style={{
                            animation: 'progress 5s linear'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

GoongYeAnouncingGameEndModal.propTypes = {
    finalCounts: PropTypes.array,
    onClose: PropTypes.func.isRequired,
};

export default GoongYeAnouncingGameEndModal;
