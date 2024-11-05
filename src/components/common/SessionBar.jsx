import { useEffect, useState } from 'react';
// import { useStoreTime } from '../store/gameInfoStore';
import ProgressBar from "@ramonak/react-progress-bar";
import '../../styles/sessionBar.css';
import PropTypes from 'prop-types';
import bombImage from '../../assets/images/bombImage.png';

const SessionBar = ({sessionTime}) => {

    //sessionTime 전체 시간
    const[initalTime, setInitalTime] = useState(sessionTime);
    const [progress,setProgress] = useState(sessionTime);

    useEffect(() => {
        if(sessionTime > 0){
            setInitalTime(sessionTime);
        }
    }, []);

    useEffect(() => {
        setProgress(sessionTime);
    }, [sessionTime]);

    //progressPercentage 계산
    const progressPercentage = ( sessionTime / initalTime) * 100;

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
                <img 
                    src={bombImage} 
                    alt="character" 
                    className="bomb-image"
                    style={{
                        left: `${(progress / initalTime) * 100}%`
                    }}
                />
            </div>
        </div>
    );
};

SessionBar.propTypes = {
    sessionTime: PropTypes.number
}

export default SessionBar;
