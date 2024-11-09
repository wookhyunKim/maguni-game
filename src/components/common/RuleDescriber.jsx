import RuleDescribe from '../../assets/images/questionIcon.png';
import { useState } from 'react';

const RuleDescriber = () =>{
    const [isBubbleVisible, setIsBubbleVisible] = useState(false);

    const toggleBubble = () => {
      setIsBubbleVisible(!isBubbleVisible);
    };
  

    return(
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
    )
}

export default RuleDescriber;