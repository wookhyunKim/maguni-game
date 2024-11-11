import { useEffect, useRef, useState } from 'react';
// import { useStoreTime } from '../store/gameInfoStore';
import ProgressBar from "@ramonak/react-progress-bar";
import '../../styles/sessionBar.css';
import PropTypes from 'prop-types';
import bombImage from '../../assets/images/bombImage.png';

// import lottie from 'lottie-web';
// import BLAST from "../../assets/lottie/blast.json"

const SessionBar = ({sessionTime}) => {
    // const containerRef = useRef(null);

    // 최대 시간을 상태로 관리
    const [maxTime, setMaxTime] = useState(sessionTime);
    const [progress, setProgress] = useState(sessionTime);

    useEffect(() => {
        // sessionTime이 현재 maxTime보다 크면 maxTime 업데이트
        if (sessionTime > maxTime) {
            setMaxTime(sessionTime);
        }
        setProgress(sessionTime);
    }, [sessionTime, maxTime]);

    // progressPercentage 계산 시 maxTime 사용
    const progressPercentage = (sessionTime / maxTime) * 100;

    // useEffect(()=>{
    //     const animationPath = BLAST; // Lottie JSON 파일 경로

    //     // path가 유효한 문자열인지 확인
    //     if (typeof animationPath === 'string' && animationPath) {
    //       lottie.loadAnimation({
    //         container: containerRef.current,
    //         renderer: 'svg',
    //         loop: true,
    //         autoplay: true,
    //         path: animationPath,
    //       });
    //     } else {
    //       console.error('Invalid path:', animationPath);
    //     }
    // },[])

    return (
        <div className="session-bar-container">
            <div className="progress-wrapper">
                <ProgressBar 
                    completed={progressPercentage}
                    maxCompleted={100}
                    customLabel={`${sessionTime}초`}
                    height="30px"
                    width="100%"
                    baseBgColor="#FFFFFF"
                    borderRadius="15px"
                    labelClassName='timeRemainedText'
                    labelAlignment="center"
                    labelColor="white"
                    labelSize="16px"
                    transitionDuration="1s"
                    className="custom-progress-bar"
                    barContainerClassName="completed-bar"
                />
                {/* <div
                    id="lottie-container"
                    // ref={containerRef}
                    style={{
                        width: '50px',
                        height: '50px',
                        position: 'relative', // 또는 'absolute', 'fixed', 'sticky'
                        zIndex: 30,           // 큰 값을 넣으면 요소가 더 앞에 오게 됩니다.
                    }}
                ></div> */}
                <div className="bomb-image-container" style={{ width: `${progressPercentage}%`, position: 'absolute', top: 0, left: 0, height: '100%' }}>
                    <img 
                        src={bombImage} 
                        alt="character" 
                        className="bomb-image"
                    />
                </div>

            </div>
        </div>
    );
};

SessionBar.propTypes = {
    sessionTime: PropTypes.number
}

export default SessionBar;
