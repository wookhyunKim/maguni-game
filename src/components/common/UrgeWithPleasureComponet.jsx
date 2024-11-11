import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useRef, useState } from 'react'
import '../../styles/urgeWithPleasure.css'
import PropTypes from 'prop-types';

const RenderTime = ({ remainingTime }) => {
  const currentTime = useRef(remainingTime);
  const prevTime = useRef(null);
  const isNewTimeFirstTick = useRef(false);
  const [, setOneLastRerender] = useState(0);

  if (currentTime.current !== remainingTime) {
    isNewTimeFirstTick.current = true;
    prevTime.current = currentTime.current;
    currentTime.current = remainingTime;
  } else {
    isNewTimeFirstTick.current = false;
  }

  if (remainingTime === 0) {
    setTimeout(() => {
      setOneLastRerender((val) => val + 1);
    }, 20);
  }

  const isTimeUp = isNewTimeFirstTick.current;

  return (
    <div className="time-wrapper">
      <div key={remainingTime} className={`time ${isTimeUp ? "up" : ""}`}>
        {remainingTime}
      </div>
      {prevTime.current !== null && (
        <div
          key={prevTime.current}
          className={`time ${!isTimeUp ? "down" : ""}`}
        >
          {prevTime.current}
        </div>
      )}
    </div>
  );
};

const UrgeWithPleasureComponent = ({duration}) => (
  <div className="timer-wrapper">
    <CountdownCircleTimer
      isPlaying
      duration={duration}
      colors={['#8B2424', '#8B2424', '#8B2424', '#8B2424']}
      size={100}
    >
      {RenderTime}
    </CountdownCircleTimer>
  </div>  
)

UrgeWithPleasureComponent.propTypes = {
  duration: PropTypes.number.isRequired,
};
  
export default UrgeWithPleasureComponent;