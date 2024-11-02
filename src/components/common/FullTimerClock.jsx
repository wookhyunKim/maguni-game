// 게임 타이머 컴포넌트
// 주요 기능:
// 1. 분:초 형식으로 시간 표시
// 2. 호스트가 게임 시작 시 타이머 시작
// 3. 모달창이 열려있을 때는 타이머 일시정지

import { useEffect} from "react";
import {useStoreTime} from "../store/gameInfoStore";  // 전역 시간 상태 관리
import '../../styles/fulltimeclock.css'

// 타이머 스타일 정의 (현재 미사용)
const timerStyles = {
    container: {
        height:'48px',
        border: '2px solid black',
        background: 'white',
        padding: '10px 30px',
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#0066FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textShadow: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black'
    }
};

// 초 단위 시간을 두 자리 숫자로 포맷팅하는 헬퍼 함수 (현재 미사용)
const getSeconds = (time) => {
    const seconds = Number(time % 60);
    if(seconds < 10) {
        return "0" + String(seconds);
    } else {
        return String(seconds);
    }
}

// 타이머 컴포넌트
// isModalOpen: 모달창 열림 여부를 전달받는 prop
const Timer = ({ isModalOpen }) => {
    // 전역 상태에서 현재 시간과 시간 감소 함수 가져오기
    const time = useStoreTime((state) => state.time);
    const decrementTime = useStoreTime((state) => state.decrementTime);

    // 타이머 로직
    useEffect(() => {
        // 시간이 0이 되면 타이머 종료
        if (time === 0) {
            console.log("타이머 종료 이벤트 호출");
            return;
        }

        // 1초마다 시간 감소
        const timer = setInterval(() => {
            // 모달이 열려있지 않을 때만 시간 감소
            if (!isModalOpen) {
                decrementTime();
            }
        }, 1000);

        // 컴포넌트 언마운트 시 타이머 정리
        return () => clearInterval(timer);
    }, [time, isModalOpen, decrementTime]);

    // 초 단위를 두 자리 숫자로 포맷팅 (예: 5 -> "05")
    const getSeconds = (time) => String(time % 60).padStart(2, '0');

    // 타이머 UI 렌더링
    return (
        <div className="timer-container">
            <div className="timer-box">
                <span className="timer-number">{parseInt(time / 60)}</span> {/* 분 */}
                <span className="timer-colon">:</span>
                <span className="timer-number">{getSeconds(time)}</span> {/* 초 */}
            </div>
        </div>
    );
};

export default Timer;