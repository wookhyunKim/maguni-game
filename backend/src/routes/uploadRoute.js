const express = require("express");
const router = express.Router();
const upload_controller = require("../controllers/uploadController");

router.post("/api/v1", upload_controller.uploadImage);
router.get("/api/v1/:roomCode", upload_controller.recvImages);

module.exports = router;
