const express = require("express");
const router = express.Router();
const member_controller = require("../controllers/memberController");

//member
router.post("/api/v1/word", member_controller.insertWord);
router.get("/api/v1/word/:roomCode/:nickname", member_controller.getAllWords);
router.get("/api/v1/word/:roomCode", member_controller.getPlayersInfo);

// game 참가
router.post("/participant/game/api/v1", member_controller.participantGame);

// game result
router.get("/game/api/v1/:roomCode", member_controller.getResults);
router.post("/game/api/v1", member_controller.checkAnswer);


module.exports = router;
