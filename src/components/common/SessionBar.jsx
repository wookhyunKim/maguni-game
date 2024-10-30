import { useState, useEffect } from "react";
import "../../styles/sessionBar.css";
import ProgressBar from "@ramonak/react-progress-bar";

const SessionBar = ({ initialTime = 120 }) => {
    const [remainingTime, setRemainingTime] = useState(initialTime);

    const getSeconds = (time) => {
        const seconds = Number(time % 60);
        return seconds < 10 ? "0" + String(seconds) : String(seconds);
    };

    // 1초씩 줄어드는 effect
    useEffect(() => {
        const interval_id = setInterval(() => {
            setRemainingTime(remainedTime => {
                if (remainedTime <= 1) {
                    clearInterval(interval_id);
                    console.log("타이머 종료 이벤트 호출");
                    return 0;
                }
                return remainedTime - 1;
            });
        }, 1000);

        return () => clearInterval(interval_id);
    }, []);

    return (
        <ProgressBar
            className="progressBar"
            completed={parseInt((remainingTime / initialTime) * 100)}
            maxCompleted={100}
            barContainerClassName="container"
            completedClassName="barRemainTime"
            customLabel={`${parseInt(remainingTime / 60)}:${getSeconds(remainingTime)} 초`}
            labelClassName="label"
        />
    );
}

export default SessionBar;
