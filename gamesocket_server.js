import { Server } from 'socket.io';
import express from "express";
import * as http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});


// 게임 상태 관리
const gameStates = {};
// 금칙어 사용 카운트 저장 객체
const forbiddenWordCounts = {};

////////////////////// 시간 동기화 관련 함수////////////////////////////

//게임 시작 시 타이머 시작하게 하는 함수
function startGameTimer(roomcode) {
  const room = gameStates[roomcode];
  if (!room) return;

  room.startTime = Date.now();
  room.isGameStarted = true;
  room.timer = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - room.startTime) / 1000);
      room.remainingTime = Math.max(300 - elapsedTime, 0); // 5분(300초)에서 감소

      // 클라이언트들에게 현재 시간 전송
      io.to(roomcode).emit('timer update', room.remainingTime);

      // 시간이 다 되었을 때
      if (room.remainingTime <= 0) {
          clearInterval(room.timer);
          io.to(roomcode).emit('game end');
      }
  }, 1000);
}
//////////////////////////////////////////////////////////////


io.on('connection', (client) => {
  console.log('사용자가 들어왔습니다!');
  const { username, roomcode } = client.handshake.query;
  client.join(roomcode); // 클라이언트를 해당 방에 입장
  // 참가자 목록 업데이트
  const users = Array.from(io.sockets.adapter.rooms.get(roomcode) || []).map(socketId => {
    return io.sockets.sockets.get(socketId).handshake.query.username;
  });

  io.to(roomcode).emit('participant list', users); // 참가자 목록 전송

  client.on('disconnect', () => {
    console.log(`사용자가 나갔습니다... ${username}`);
    
    
    /////////////////////////////금칙어 사용 카운트 초기화/////////////////////////////
    delete forbiddenWordCounts[username];

    const users = Array.from(io.sockets.adapter.rooms.get(roomcode) || []).map(socketId => {
      return io.sockets.sockets.get(socketId).handshake.query.username;
    });
    io.to(roomcode).emit('participant list', users); // 참가자 목록 전송
  });

  client.on('forbidden word used', (username, occurrences) => {
    // 금칙어 사용 카운트 업데이트 로직
    if (!forbiddenWordCounts[username]) {
      forbiddenWordCounts[username] = 0; // 초기화
    }
    forbiddenWordCounts[username] += occurrences; // 카운트 증가

    // 모든 클라이언트에 카운트 업데이트
    io.emit('update forbidden word count', forbiddenWordCounts);
  });

  /////////////////////시간 동기화 관련///////////////////////////////
    // 게임 시작 요청 처리
    client.on('ready for game', () => {
      const room = gameStates[roomcode];
      console.log('ready for game');
      if (!room) return; 

      room.readyPlayers.add(client.id);

      // 모든 플레이어가 준비되었는지 확인
      const allPlayers = io.sockets.adapter.rooms.get(roomcode);
      if (allPlayers && room.readyPlayers.size === allPlayers.size) {
          startGameTimer(roomcode);
          io.to(roomcode).emit('game start');
      }
  });

  // 클라이언트 재접속시 시간 동기화
  client.on('request time sync', () => {
      const room = gameStates[roomcode];
      if (room && room.isGameStarted) {
          client.emit('timer update', room.remainingTime);
      }
  });
});


server.listen(3002, () => {
  console.log('서버에서 듣고 있습니다.. 3002');
});
