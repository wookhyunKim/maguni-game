import { useLocation,useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../styles/endGame.css'
import WallImage from '../assets/images/endPage_bgImage.jpg'
import MontageConatainer from '../components/common/montageConatainer';

const EndGamepage = () => {
    const location = useLocation();
    const { result, words, roomCode } = location.state || {};

    const gotoPhoto = ()=>{
      navigate('/photo',{state : {roomCode:roomCode}})
    }



    //유저별로 금칙어 단어, 그리고 위반 횟수 표시
    const displayResults = () => {
      if (!result || !words) return "데이터 없음";
      
      return words.map(userInfo => {
          const nickname = userInfo.nickname;
          const forbiddenWord = userInfo.words[0]; // 금칙어 배열의 첫 번째 항목
          const violationCount = result[nickname] || 0; // 해당 유저의 위반 횟수

          return (
              <MontageConatainer key={nickname} className="user-result">
                <div >
                    <p>닉네임: {nickname}</p>
                    <p>금칙어: {forbiddenWord}</p>
                    <p>위반 횟수: {violationCount}회</p>
                </div>
              </MontageConatainer>
          );
      });
  };

    return (
      <div className="endGame-container">
        <div className="wallImage" style={{backgroundImage: `url(${WallImage})`}}>
          <div className="result-container">
            <div className="result-title">금칙어 위반 역적</div>
            <div className="hanji-container">
              {/* 여기안에 한지 몽타주들 옴 */}
              {displayResults()}
            </div>
          </div>
          <div className="endPageFooter">
            <button onClick={gotoPhoto}>추억 남기기</button>
          </div>
        </div>
      </div>
    );
  };

export default EndGamepage
