const UploadDao = require("../Dao/uploadDao");
const fs = require("fs").promises;
const path = require("path");
const static = require("serve-static");
const sharp = require("sharp");

async function uploadImage(image, filename) {
    resizing(image, filename);
    const result = await UploadDao.uploadImage(filename);
    return result;
}

async function resizing(image, filename) {
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const filePath = path.join(__dirname, "../images", filename);
    const imageBuffer = Buffer.from(base64Data, "base64");

    try {
        await sharp(imageBuffer).resize(525, 300).toFile(filePath);
    } catch (err) {
        console.error("Error saving image:", err);
        throw err;
    }
}

async function recvImages(roomCode) {
    const files = await UploadDao.recvImages(roomCode);
    return files;
}

// 파일명이 DB와 다를 때 방코드로 이미지를 찾는 방법
async function findImages(roomCode) {
    let imageList = [];
    const imagesDir = path.join(__dirname, "../images");
    try {
        const allFiles = await fs.readdir(imagesDir);
        imageList = allFiles.filter(
            (file) => file.startsWith(roomCode) && file.endsWith(".png")
        );
        return imageList;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    uploadImage,
    recvImages,
};
