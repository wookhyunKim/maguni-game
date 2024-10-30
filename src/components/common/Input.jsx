import { useState, useEffect } from 'react';
import '../../styles/input.css'
import axios from 'axios';
import PropTypes from 'prop-types'; 


function Input({username, roomcode}) {

//상태관리: inputvlaue, getcode
const [inputValue, setInputValue] = useState('');
const [getCode,setGetCode] = useState('');



useEffect(() => {
  console.log(getCode)
}, [getCode]);

//
const handleInputChange = (e) => {
    setInputValue(e.target.value);
};

const insertWord = ()=>{
    return axios({
        method: "POST",
        url: "http://localhost:3001/member/api/v1/word",
        data: {
            "roomCode": roomcode,
            "nickname": username,
            "word": inputValue
        },
    }).then((res)=>{
        console.log(res.data['success'])
        return getWords();
    }).catch((err)=>{
        console.log(err)
    })
}


    //
    const getWords = ()=>{
      return axios({
          method: "GET",
          url: `http://localhost:3001/member/api/v1/word/${roomcode}/${username}`,
      }).then((res)=>{
          // console.log(res.data[0][0])
          setGetCode(res.data[0][0])
   

          // setGetCode(prevGetCode => [...prevGetCode, 'sk']);
      }).catch((err)=>{
          console.log(err)
      })
  }
return (
  <div className="input-group" style={{ margin: '10px 0' }}>
      <input 
          type="text"
          className="form-control"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="메시지를 입력하세요"
      />
      <button 
          className="btn btn-primary"
          onClick={insertWord}
          style={{ marginLeft: '5px' }}
      >
          전송
      </button>
  </div>
);
}
// PropTypes 정의 추가
Input.propTypes = {
    username: PropTypes.string.isRequired,
    roomcode: PropTypes.string.isRequired
};



export default Input;