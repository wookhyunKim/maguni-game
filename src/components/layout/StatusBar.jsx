import React, { useState } from 'react';
import Timer from '../common/FullTimerClock';
import ProfileCard from '../common/ProfileCard';
import SessionBar from '../common/SessionBar';
import '../../styles/statusBar.css';
import teamLogo from '../../assets/images/teamLogoImage.png';
import PropTypes from 'prop-types';
import RuleDescribe from '../../assets/images/questionIcon.png';

const StatusBar = ({ sessionTime, username, roomcode }) => {
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);

  const toggleBubble = () => {
    setIsBubbleVisible(!isBubbleVisible);
  };

  return (
    <div className="status-bar">
      <img className="teamLogo" src={teamLogo} alt="팀 로고"/>
      <div id="sessionTitleContianer">
        <h1 id="session-title">{roomcode}</h1>
      </div>
      <SessionBar className="sessionBar" sessionTime={sessionTime}/>
      <ProfileCard 
        className="profileCard"
        nickname={username}
        playerNumber={1}
      />
      <Timer className="timer"/>
      <div className="rule-container">
        <img 
          className="ruleDescribe" 
          src={RuleDescribe} 
          alt="룰 설명" 
          onClick={toggleBubble} 
        />
        {isBubbleVisible && (
          <div className="speech-bubble">
            <p>게임 규칙에 대한 설명이 여기에 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

StatusBar.propTypes = {
  sessionTime: PropTypes.number,
  username: PropTypes.string,
  roomcode: PropTypes.string
};

export default StatusBar;