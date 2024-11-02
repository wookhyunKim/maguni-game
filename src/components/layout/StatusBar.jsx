import Timer from '../common/FullTimerClock'
import ProfileCard from '../common/ProfileCard'
import SessionBar from '../common/SessionBar'
import '../../styles/statusBar.css'
import teamLogo from '../../assets/images/teamLogoImage.png'
import PropTypes from 'prop-types';

const StatusBar = ({ sessionTime, username }) => {
  return (
    <div className="status-bar">
        <img className="teamLogo" src={teamLogo} alt="팀 로고"/>
        <SessionBar className="sessionBar" sessionTime={sessionTime}/>
        <ProfileCard 
            className="profileCard"
            nickname={username}
            playerNumber={1}
        />
        <Timer className="timer"/>
    </div>
  )
}

StatusBar.propTypes = {
    sessionTime: PropTypes.number,
    username: PropTypes.string
};

export default StatusBar
