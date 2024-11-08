import Timer from '../common/FullTimerClock';
import ProfileCard from '../common/ProfileCard';
import SessionBar from '../common/SessionBar';
import '../../styles/statusBar.css';
import teamLogo from '../../assets/images/teamLogoImage.png';
import PropTypes from 'prop-types';
import RuleDescriber from '../common/RuleDescriber';

const StatusBar = ({ sessionTime, username, roomcode }) => {
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
      <RuleDescriber />
    </div>
  );
}

StatusBar.propTypes = {
  sessionTime: PropTypes.number,
  username: PropTypes.string,
  roomcode: PropTypes.string
};

export default StatusBar;