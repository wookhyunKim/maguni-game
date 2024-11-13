// 게임 타이머 컴포넌트
// 주요 기능:
// 1. 분:초 형식으로 시간 표시
// 2. 호스트가 게임 시작 시 타이머 시작
// 3. 모달창이 열려있을 때는 타이머 일시정지

import { useEffect} from "react";
import {useStoreTime} from "../store/gameInfoStore";  // 전역 시간 상태 관리
import '../../styles/fulltimeclock.css'
import PropTypes from 'prop-types';


// 타이머 컴포넌트
// isModalOpen: 모달창 열림 여부를 전달받는 prop
const Timer = ({ isModalOpen }) => {
    // 전역 상태에서 현재 시간과 시간 감소 함수 가져오기
    const time = useStoreTime((state) => state.time);
    const incrementTime = useStoreTime((state) => state.incrementTime);

    // 타이머 로직
    useEffect(() => {
        // 1초마다 시간 증가
        const timer = setInterval(() => {
            if (!isModalOpen) {
                incrementTime();
            }
        }, 1000);

        // 컴포넌트 언마운트 시 타이머 정리
        return () => clearInterval(timer);
    }, [isModalOpen, incrementTime]);

    // 초 단위를 두 자리 숫자로 포맷팅
    const getSeconds = (time) => String(time % 60).padStart(2, '0');
    const getMinutes = (time) => String(Math.floor(time / 60)).padStart(2, '0');

    // 타이머 UI 렌더링
    return (
        <div className="timer-container">
            <div className="timer-box">
                <span className="timer-number">{getMinutes(time)}</span>
                <span className="timer-colon">:</span>
                <span className="timer-number">{getSeconds(time)}</span>
            </div>
        </div>
    );
};

Timer.propTypes = {
    isModalOpen: PropTypes.bool.isRequired
};

export default Timer;