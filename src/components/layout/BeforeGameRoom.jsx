
import PropTypes from 'prop-types';
import { useState } from 'react';
import SOUNDON from "../../assets/images/volumeUp.svg"
import SOUNDOFF from "../../assets/images/volumeMute.svg"


// const BeforeGameRoom = ({children}) => {
  const BeforeGameRoom = () => {

  const [music, setMusic] = useState(false);

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
      <img 
      src={music?SOUNDOFF:SOUNDON} 
      alt="" 
      onClick={playMusic} 
      style={{ width: '50px', height: '50px', cursor: 'pointer' }} 
      />  
      <div>
        {/* {children} */}
        {/* <audio id="bgm" src={BEGINBGM} autoPlay={true}></audio> */}
      </div>
    </>

  )
}

BeforeGameRoom.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BeforeGameRoom
