import '../../styles/footer.css'
import soundOnIcon from '../../assets/images/SoundOnIcon.png';
import soundOffIcon from '../../assets/images/SoundOffIcon.png';
import treasureCardsIcon from '../../assets/images/treasureCardsIcon.png';
import {useNavigate} from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  function quitGame(){
    navigate('/');
    window.location.reload();
  }

  return (
    <div className="footer">
        <div className="footer-icons-container">
          <div className="sidebar-btn">
            {/*여기에 onclick으로 leaveSession하면서 방 나가기 해야될듯*/}
             <input className="btn btn-large btn-danger"
                    type="button"
                    id="buttonLeaveSession"
                    onClick={() => quitGame()}
                    value="게임 종료" />
          </div>
          <img className="footer-icon" src={soundOnIcon} alt="Sound On" />
          <img className="footer-icon" src={soundOffIcon} alt="Sound Off" />
          <img className="footer-icon" src={treasureCardsIcon} alt="Treasure Cards" />
        </div>
    </div>
  )
}

export default Footer
