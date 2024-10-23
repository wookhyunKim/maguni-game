import { Server } from 'socket.io';
import express from "express";
import * as http from "http";
import ViteExpress from "vite-express"

const app = express();
const server = http.createServer(app);


const io = new Server(server, { //모든 클라이언트가 접근 가능한 웹 소켓 서버
    cors: {
        origin: "*"
    }
});

// 금칙어 목록
const forbiddenWords = ['야', '응', '오키', '뭐', '팀장', '하이', '니', '뭔데', '나', '음', '인정', '정글', '나만무', '행복', '그만', '가보자', '베고파'];
//사용자별 금칙어 목록
var userforbiddenWordlist = [];

let gameDuration = 2 * 60 * 1000;        // 3 * 60 * 1000; // 3분 = 180000ms
let gameTimer;

function startGameTimer() {
    console.log('게임시작 10초')
    // 타이머 시작 (3분)
    io.emit('timer start', gameDuration / 1000);
    gameTimer = setTimeout(() => {
        // 필요시 추가적인 게임 종료 로직
        endGame();
    }, gameDuration + 1000);
}

function endGame() {
    // 게임 종료 후 리셋하거나, 점수 처리, 리셋된 상태 전송 등의 작업을 수행
    console.log('게임이 종료되었습니다.');

    io.emit('game over', userforbiddenWordlist);
}





io.on('connection', (client) => {               //client가 연결되면 실행
    console.log('사용자가 들어왔습니다!');
    console.log(client.handshake.query);        //client의 query 접근 가능

    const connectedClientUsername = client.handshake.query.username;

    console.log(`사용자가 들어왔습니다! ${connectedClientUsername}`);

    client.on('start game', () => {
        console.log('게임 시작');
        startGameTimer(); // 게임 시작 시 타이머 시작
    });

    // 랜덤으로 금칙어 선택
    const newForbiddenWord = forbiddenWords[Math.floor(Math.random() * forbiddenWords.length)];
    const userForbiddenWord = { username: connectedClientUsername, forbiddenword: newForbiddenWord, count: 0 };
    userforbiddenWordlist.push(userForbiddenWord);

    // 클라이언트에 금칙어 전송
    client.emit('forbidden word', newForbiddenWord);
    // 금칙어 리스트 전송
    io.emit('forbidden word list', userforbiddenWordlist);

    client.broadcast.emit('new message', { username: "관리자", message: `${connectedClientUsername}님이 방에 들어왔습니다!` });  //클라이언트 제외한 나머지 모든 클라에게 이벤트 전송

    client.on('new message', (msg) => {         //client로부터 new message 받으면 실행
        console.log(msg);                       //서버가 받아서 콘솔에 출력하고

        // 금칙어 체크
        if (msg.message.includes(msg.forbiddenWord)) {
            const forbiddenWordEntry = userforbiddenWordlist.find(e => e.username === connectedClientUsername);
            forbiddenWordEntry.count += 1;
            client.broadcast.emit('alert forbidden word', `${msg.username}이(가) 금칙어 "${msg.forbiddenWord}"를 사용했습니다! 현재 사용 횟수: ${forbiddenWordEntry.count}`);
            io.emit('forbidden word list', userforbiddenWordlist);
        }


        io.emit('new message', { username: msg.username, message: msg.message });   //모든 클라이언트에게 메세지 전달
    })

    client.on('disconnect', () => {         //client로부터 disconnection
        console.log(`사용자가 나갔습니다... ${connectedClientUsername}`);
        userforbiddenWordlist = userforbiddenWordlist.filter(item => item.username !== connectedClientUsername);

        io.emit('new message', { username: "관리자", message: `${connectedClientUsername}님이 방에서 나갔습니다..` });


        io.emit('forbidden word list', userforbiddenWordlist);
    })
});

server.listen(3000, () => {
    console.log('서버에서 듣고 있습니다.. 3000');
});

ViteExpress.bind(app, server);