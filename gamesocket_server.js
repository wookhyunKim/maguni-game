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
    
    // 금칙어 사용 카운트 초기화
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
});

server.listen(3002, () => {
  console.log('서버에서 듣고 있습니다.. 3002');
});
