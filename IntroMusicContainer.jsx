import { createContext, useState } from 'react';
import BEGINBGM from "./src/assets/bgm/beginbgm.mp3";
import PropTypes from 'prop-types';

export const Context = createContext({
  isPlay: false,
  setIsPlay: () => {}
});

const IntroMusicContainer = ({ children }) => { 
  const [isPlay, setIsPlay] = useState(true);

  return (
    <Context.Provider value={{ isPlay, setIsPlay }}>
      {children}
      {isPlay && (
        <audio 
          id="bgm" 
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