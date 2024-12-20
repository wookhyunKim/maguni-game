import { useState, useEffect } from 'react';
import '../../styles/input.css';
import axios from 'axios';
import PropTypes from 'prop-types'; 

function Input({ username, roomcode, showInput, onComplete }) {
  const [inputValue, setInputValue] = useState('');
  const [getCode, setGetCode] = useState('');
  const [gamers, setGamers] = useState([]);
  const [playerlist, setPlayerlist] = useState([]);
  const [index, setIndex] = useState(-1);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    // 한글만 허용하는 정규식 (자음, 모음, 완성된 한글)
    const koreanOnly = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/;

    // 한글만 있고 공백이 없는 경우에만 입력값 업데이트
    if (koreanOnly.test(newValue) && !newValue.includes(' ')) {
      setInputValue(newValue);
    }
  };

  const insertWord = () => {
    setInputValue('');
    return axios({
      method: 'POST',
      url: 'http://localhost:3001/member/api/v1/word',
      data: {
        roomCode: roomcode,
        nickname: index !== 0 ? playerlist[index - 1] : playerlist[playerlist.length - 1],
        word: inputValue,
      },
    })
      .then((res) => {
        return getWords();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getWords = () => {
    return axios({
      method: 'GET',
      url: `http://localhost:3001/member/api/v1/word/${roomcode}/${username}`,
    })
      .then((res) => {
        setGetCode(res.data[0][0]);
        return getPlayersInfo();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPlayersInfo = () => {
    return axios({
      method: 'GET',
      url: `http://localhost:3001/member/api/v1/word/${roomcode}`,
    })
      .then((res) => {
        setGamers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPlayersInfo();
  }, []);

  useEffect(() => {
    setPlayerlist(gamers.map((gamer) => gamer.nickname));
    const currentIndex = gamers.findIndex((gamer) => gamer.nickname === username);
    setIndex(currentIndex);
  }, [gamers, username]);


const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
        insertWord();
        onComplete();
    }
};

return (
    <>
        <p>{index !=0? playerlist[index-1]: playerlist[playerlist.length-1]} 마구니의 금칙어를 입력하거라!</p>
        <form onSubmit={handleSubmit} className={`input-group ${showInput ? 'blinking-border' : ''}`} style={{ margin: '10px 0' }}>
            <input 
                type="text"
                className="form-control"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="한글만 입력 가능"
                pattern="[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+"
            />
            <button 
                type="submit"
                className="sendBtn btn btn-primary"
            >
                완료
            </button>
        </form>
    </>
  );
}

Input.propTypes = {
  username: PropTypes.string.isRequired,
  roomcode: PropTypes.string.isRequired,
  showInput: PropTypes.bool.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default Input;