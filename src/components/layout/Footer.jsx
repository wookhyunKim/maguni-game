import Input from '../common/Input'
import Button from '../common/Button'
import '../../styles/footer.css'
import soundOnIcon from '../../assets/images/SoundOnIcon.png';
import soundOffIcon from '../../assets/images/SoundOffIcon.png';
import treasureCardsIcon from '../../assets/images/treasureCardsIcon.png';

const Footer = () => {
  return (
    <div className="footer">
        <div className="footer-tip">
          <div className="footer-icons-container">
            <img className="footer-icon" src={soundOnIcon}></img>
            <img className="footer-icon" src={soundOffIcon}></img>
            <img className="footer-icon" src={treasureCardsIcon}></img>
          </div>
        </div >
        {/* click시 발생할 로직 추가해야 */}
        <div className="footer-btn">
          {/*여기에 onclick으로 leaveSession하면서 방 나가기 해야될듯*/}
          <Button variant="red" size="medium">게임 종료</Button>
        </div>
        <div className="footer-input">
          <Input></Input>
        </div>
    </div>
  )
}

export default Footer
