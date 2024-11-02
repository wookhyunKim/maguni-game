import { useEffect, useState } from 'react';
import { useStoreTime } from '../store/gameInfoStore';
import ProgressBar from "@ramonak/react-progress-bar";
import '../../styles/sessionBar.css';
// import characterImage from '../../assets/images/bombImage.png';

const SessionBar = ({sessionTime}) => {
    const time = useStoreTime((state) => state.time);
    const [progress, setProgress] = useState(sessionTime);

    useEffect(() => {
        // time이 변경될 때마다 progress 업데이트
        setProgress(time);
    }, [time]); // time이 변경될 때마다 실행

    return (
        <div className="session-bar-container">
            <div className="progress-wrapper">
                <ProgressBar 
                    completed={progress}
                    maxCompleted={sessionTime}
                    customLabel={`${progress}초`}
                    height="30px"
                    width="100%"
                    baseBgColor="#FFFFFF"
                    borderRadius="15px"
                    labelAlignment="center"
                    labelColor="#ffffff"
                    labelSize="16px"
                    transitionDuration="1s"
                    className="custom-progress-bar"
                    barContainerClassName="completed-bar"
                />
                {/* <img 
                    src={characterImage} 
                    alt="character" 
                    className="character-image"
                    style={{
                        left: `${(progress / sessionTime) * 100}%`,
                        transform: 'translateX(-50%)'
                    }}
                /> */}
            </div>
        </div>
    );
};

export default SessionBar;
