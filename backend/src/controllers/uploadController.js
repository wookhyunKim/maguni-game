const UploadService = require("../services/uploadService");

async function uploadImage(req, res) {
    const { image, filename } = req.body;

    const result = await UploadService.uploadImage(image, filename);
    if (result) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
}

async function recvImages(req, res) {
    const roomCode = req.params.roomCode;

    const result = await UploadService.recvImages(roomCode);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: "error.message" });
    }
}

module.exports = {
    uploadImage,
    recvImages,
};
