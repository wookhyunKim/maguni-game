import '../../styles/footer.css'
import soundOnIcon from '../../assets/images/SoundOnIcon.png';
import soundOffIcon from '../../assets/images/SoundOffIcon.png';
import treasureCardsIcon from '../../assets/images/treasureCardsIcon.png';

const Footer = () => {
  return (
    <div className="footer">
        <div className="footer-icons-container">
          <img className="footer-icon" src={soundOnIcon} alt="Sound On" />
          <img className="footer-icon" src={soundOffIcon} alt="Sound Off" />
          <img className="footer-icon" src={treasureCardsIcon} alt="Treasure Cards" />
        </div>
    </div>
  )
}

export default Footer
