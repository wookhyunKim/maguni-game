const MemberDao = require("../Dao/memberDao");

async function insertWord(roomCode, nickname, word) {
    const result = await MemberDao.insertWord(roomCode, nickname, word);
    return result;
}
async function participantGame(roomCode,nickname) {
    const result = await MemberDao.participantGame( roomCode,nickname);
    return result;
}
async function getAllWords(roomCode, nickname) {
    const result = await MemberDao.getAllWords(roomCode, nickname);
    return result;
}
async function getPlayersInfo(roomCode ) {
    const result = await MemberDao.getPlayersInfo(roomCode);
    return result;
}
async function getResults(roomCode ) {
    const result = await MemberDao.getResults(roomCode);
    return result;
}

async function checkAnswer(roomCode, nickname, word) {
    let check ;
    const gotWord = await MemberDao.getAllWords(roomCode, nickname);
    console.log("got word : ", gotWord)
    if (gotWord[0][0] == word){
        check = true;
    }else{
        check = false;
    }
    const result = await MemberDao.checkAnswer(roomCode, nickname, check);
    return result;
}
module.exports = {
    insertWord,
    getAllWords,
    participantGame,
    getPlayersInfo,
    checkAnswer,
    getResults
};
