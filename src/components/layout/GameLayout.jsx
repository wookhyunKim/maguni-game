import PropTypes from 'prop-types';
import { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/beforeGameRoom.css';
import SOUNDON from "../../assets/images/volumeUp.svg"
import SOUNDOFF from "../../assets/images/volumeMute.svg"
import backgroundImage from "../../assets/images/endPage_bgImage.webp"


const GameLayout = ({ children, title, subtitle }) => {

    const [music, setMusic] = useState(false);
    const navigate = useNavigate();
    const playMusic = () => {
      const audio = document.getElementById('beginbgm');
      setMusic(!music)
      if (!audio) {
          return;
      }
      if (!audio.paused) {
          // 이미 재생 중인 경우 음소거 설정
          audio.muted = !audio.muted; // 음소거/음소거 해제 토글
      } else {
          audio.play().catch(error => {
              console.log("재생 오류:", error);
          });
      }
    };
  return (
    <>
      <div className="beforeGameRoomBody" style={{backgroundImage: `url(${backgroundImage})`}}>
        <div className="game-title">
          <h1>{title || "금칙어 게임"}</h1>
          <h5>{subtitle || "Never, say The word"}</h5>
        </div>
        <div className="game-container">
          {children}
        </div>
        <div className="beforeGameRoomFooter">
            <button 
                className="backButton beforeGameRoomFooterBtn" 
                onClick={() => navigate(-1)}
            >
                뒤로가기
            </button>
            <div className="soundcontrolSection">
              <div className="soundBtnContainer">
                  <img 
                  src={music?SOUNDON:SOUNDOFF} 
                  alt="" 
                  onClick={playMusic} 
                  style={{ width: '50px', height: '50px', cursor: 'pointer' }} 
                  />  
              </div>
            </div>

        </div>
      </div>
      
    </>
  );
};

GameLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string
};

export default GameLayout; 