import React from 'react'
import { useLocation } from 'react-router-dom';

const EndGamepage = () => {
    const location = useLocation();
    const { result, roomCode } = location.state || {}; // state가 있을 때만 받도록 처리
  
    return (
        <div>
        <h1>Game Results</h1>
        {console.log("result : ",result)}
        <p>Room Code: {roomCode}</p>
      </div>
    );
  };


export default EndGamepage
