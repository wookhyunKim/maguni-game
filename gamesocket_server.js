import { Server } from 'socket.io';
import express from "express";
import * as http from "http";
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const cors = require('cors');
app.use(cors({ origin: 'https://main.maguni-game.com' }));


const io = new Server(server, { 
  cors: {
    origin: "*"
  }
});


// 금칙어 사용 카운트 저장 객체
const forbiddenWordCounts = {};
let totalCount = 1;

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
    delete forbiddenWordCounts[username];
    const users = Array.from(io.sockets.adapter.rooms.get(roomcode) || []).map(socketId => {
      return io.sockets.sockets.get(socketId).handshake.query.username;
    });
    io.to(roomcode).emit('participant list', users); // 참가자 목록 전송
  });

  client.on('forbidden word used count', (username, occurrences) => {
    // 금칙어 사용 카운트 업데이트 로직
    if (!forbiddenWordCounts[username]) {
      forbiddenWordCounts[username] = 0; // 초기화
    }
    forbiddenWordCounts[username] += occurrences; // 카운트 증가
    totalCount += occurrences; //사진찍기 위한 카운트

    // 모든 클라이언트에 카운트 업데이트
    io.emit('update forbidden word count', forbiddenWordCounts);

    if (totalCount % 3 == 0) {
      io.emit('take a picture', username);
    }
  });

  client.on('forbidden word used hit', (username) => {
    io.emit('hit user', username);
  });

  // 금칙어 설정 후 게임 시작하게 하는 함수
  client.on('start game', (roomcode, startTime) => {
    let timer = startTime;
    const countdownInterval = setInterval(() => {
      io.to(roomcode).emit('timer update', timer);
      timer--;

      if (timer < 0) {
        clearInterval(countdownInterval);
        io.to(roomcode).emit('game ended', forbiddenWordCounts); // 게임 종료 및 최종 결과 전송
      }
    }, 1000);
  });


  client.on('start setting word', (roomcode) => {
    io.to(roomcode).emit('open instruction modal');

    // 모달이 닫히는 시간(12초) 이후에 타이머 시작
    setTimeout(() => {
      let timer = 20;
      const countdownInterval = setInterval(() => {
        io.to(roomcode).emit('timer update', timer);
        timer--;
        if (timer < 0) {
          clearInterval(countdownInterval);
          io.to(roomcode).emit('setting word ended');
        }
      }, 1000);
    }, 13000); // 모달 표시 시간(12초) + 500ms 버퍼
  });




});


server.listen(3002, () => {
  console.log('서버에서 듣고 있습니다.. 3002');
});
