import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../components/store/playerStore';
import '../styles/beforeGameRoom.css'
import '../styles/nicknamePageInput.css'
import nextButton from '../assets/images/nextButton.png'
import {nicknames} from "../assets/utils/nicknames.js"
import { useEffect, useState } from 'react';


const NicknamePage = () => {
 
  //store을 import해와서, 그곳에 username을 저장함
  const username = usePlayerStore(state=>state.username);
  const setUsername = usePlayerStore(state=>state.setUsername);


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
  
  
    return (
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
                onChange={(e) => setUsername(e.target.value)}
                placeholder="사용자 이름을 입력하세요"
            />
            <img src={nextButton} type="submit" onClick={handleSubmit}></img>
            </form>
            <br/><br/><br/>
            <a href="" onClick={createNickName} style={{ fontWeight: 'bold' }}>무작위 별명</a>
          </div>
        </div>
    );
}

export default NicknamePage



