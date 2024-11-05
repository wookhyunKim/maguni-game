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


// 금칙어 사용 카운트 저장 객체
const forbiddenWordCounts = {};

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

  client.on('forbidden word used', (username, occurrences) => {
    // 금칙어 사용 카운트 업데이트 로직
    if (!forbiddenWordCounts[username]) {
      forbiddenWordCounts[username] = 0; // 초기화
    }
    forbiddenWordCounts[username] += occurrences; // 카운트 증가

    // 모든 클라이언트에 카운트 업데이트
    io.emit('update forbidden word count', forbiddenWordCounts);
    io.emit('hit user', username, occurrences);
  });

  client.on('start game', (roomcode,startTime) => {
    console.log("게임 시작, roomcode:", roomcode, "startTime:", startTime);
    let timer = startTime;
    const countdownInterval = setInterval(() => {
      io.to(roomcode).emit('timer update', timer);
      timer--;

      if (timer < 0) {
        clearInterval(countdownInterval);
        console.log(forbiddenWordCounts);
        io.to(roomcode).emit('game ended', forbiddenWordCounts); // 게임 종료 및 최종 결과 전송
      }
    }, 1000);
  });


  client.on('start setting word', (roomcode) => {
    let timer = 15;
    const countdownInterval = setInterval(() => {
      io.to(roomcode).emit('timer update', timer);
      timer--;
      if(timer === 14) {
        io.to(roomcode).emit('open modal'); 
      }


      if (timer < 0) {
        clearInterval(countdownInterval);
        io.to(roomcode).emit('setting word ended'); 
      }
    }, 1000);
  });
  



});


server.listen(3002, () => {
  console.log('서버에서 듣고 있습니다.. 3002');
});
