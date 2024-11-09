import { useNavigate } from 'react-router-dom';
import { UsePlayerStore } from '../components/store/playerStore';
import '../styles/beforeGameRoom.css'
import '../styles/nicknamePageInput.css'
import nextButton from '../assets/images/nextButton.png'
import {nicknames} from "../assets/utils/nicknames.js"
import { useEffect, useState } from 'react';
import BeforeGameRoom from '../components/layout/BeforeGameRoom.jsx';


const NicknamePage = () => {
 
  //store을 import해와서, 그곳에 username을 저장함
  const username = UsePlayerStore(state=>state.username);
  const setUsername = UsePlayerStore(state=>state.setUsername);
  const [showWarning, setShowWarning] = useState(false); // 경고 메시지 상태 추가


    const navigate = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (username.trim()) {
        navigate('/hostguest');
      }
    };
    const createNickName = (e) => {
      e.preventDefault();
      const randomIndex = Math.floor(Math.random() * nicknames.nicknameList.length); // nicknameList의 길이만큼 랜덤 인덱스 생성
      const nickname = nicknames.nicknameList[randomIndex]; // 랜덤 인덱스로 닉네임 선택
      setUsername(nickname); // 선택된 닉네임을 setUsername에 설정
    }

    const handleBack = () => {
      navigate('/');
    }

    const handleInputChange = (e) => {
      const value = e.target.value;

      if (value.length <= 10) {
        setUsername(value);
      }
    };
  
  
    return (
      <>
        <div className="beforeGameRoomBody">
          <div className="game-container">
            <div className='titleContainer'>
              <h1 className='game-title text-center text-5xl text-'>금칙어 게임</h1>
              <h5>Never, Say The word</h5>
            </div>

            <form className='nicknameInputContainer' onSubmit={handleSubmit}>
            <input className='nicknameInput'
                type="text"
                value={username||""}
                onChange={handleInputChange}
                placeholder="사용자 이름을 입력하세요 (최대 10글자)"
                maxLength={10}  // HTML 수준에서도 제한
            />
            <img src={nextButton} type="submit" onClick={handleSubmit}></img>
            </form>
            <div className='nicknameRandomBtnContainer'>
              <button className='nicknameRandomBtn' onClick={createNickName} >랜덤 닉네임 생성</button>
            </div>

          </div>
        </div>
          <div className="beforeGameRoomFooter">
            <button className="backButton beforeGameRoomFooterBtn" onClick={handleBack}>뒤로가기</button>
        </div>
        <BeforeGameRoom/>
      </>

    );
}

export default NicknamePage



