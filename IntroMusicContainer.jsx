import { createContext, useState, useEffect } from 'react';
import BEGINBGM from "./src/assets/bgm/beginbgm.mp3";
import PropTypes from 'prop-types';

export const Context = createContext({
  isPlay: false,
  setIsPlay: () => {}
});

const IntroMusicContainer = ({ children }) => { 
  const [isPlay, setIsPlay] = useState(true);

  useEffect(() => {
    const audio = document.getElementById('beginbgm');
    if (audio) {
      audio.volume = 0.2; // 음량을 20%로 설정
    }
  }, []);

  return (
    <Context.Provider value={{ isPlay, setIsPlay }}>
      {children}
      {isPlay && (
        <audio 
          id="beginbgm" 
          src={BEGINBGM} 
          autoPlay={true}
        />
      )}
    </Context.Provider>
  );
};

IntroMusicContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
export default IntroMusicContainer; 