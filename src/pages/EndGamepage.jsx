import { useLocation,useNavigate } from 'react-router-dom';
import '../styles/endGame.css'
import WallImage from '../assets/images/endPage_bgImage.jpg'
import MontageConatainer from '../components/common/montageConatainer';
import MontageImage from '../assets/images/montage'

const EndGamepage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { result, words, roomCode } = location.state || {};

    // const gotoPhoto = ()=>{
    //   navigate('/photo',{state : {roomCode:roomCode}})
    // }

    //추억 남기기 버튼 눌렀을 때, 다른 페이지로 이동함
    const gotoFourcut = ()=>{
      navigate('/fourcut',{state : {roomCode:roomCode}})
    }

    //montage 파일에서 랜덤으로 이미지 가져오기
    const getRandomMontage = ()=>{
      const randomIndex = Math.floor(Math.random() * MontageImage.length);
      return MontageImage[randomIndex];
    }

    //랜덤으로 선택한 하나의 이미지
    const randomMontage = getRandomMontage();



    //유저별로 금칙어 단어, 그리고 위반 횟수 표시
    const displayResults = () => {
      if (!result || !words) return "데이터 없음";
      
      return words.map(userInfo => {
          const nickname = userInfo.nickname;
          const forbiddenWord = userInfo.words[0]; // 금칙어 배열의 첫 번째 항목
          const violationCount = result[nickname] || 0; // 해당 유저의 위반 횟수

          return (
              <MontageConatainer key={nickname} className="user-result">
                <>
                    <div className="hanji-text">
                      <p className="hanji-forbiddenWord">금칙어: {forbiddenWord}</p>
                      <p className="hanji-count">위반횟수: {violationCount}회</p>
                    </div>
                    <div className="hanji-img-container">
                      <img className="one-montage"src={randomMontage} alt="montage"/>
                    </div>
                    <div className="hanji-username">
                      <p>{nickname}</p>
                    </div>
                </>
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
            {/* <button onClick={gotoPhoto}>추억 남기기</button> */}
            <button onClick={gotoFourcut}>추억 남기기</button>
          </div>
        </div>
      </div>
    );
  };

export default EndGamepage
