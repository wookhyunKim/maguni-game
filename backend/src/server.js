const express = require("express");
const app = express();
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const static = require("serve-static");
dotenv.config(); // .env 파일의 변수를 불러옵니다.

const cors = require("cors");
app.use(
    cors({
        origin: [
            "https://main.maguni-game.com",
            "http://localhost:5175",
        ], // 특정 도메인만 허용
        methods: ["GET", "POST", "PATCH", "DELETE"], // 특정 HTTP 메서드만 허용
        credentials: true, // 쿠키 공유가 필요한 경우 설정
        exposedHeaders: ["Content-Disposition"], // 필요시 설정
    })
);

const PORT = 3001;

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// 절대 경로로 이미지 디렉토리 설정
const imagesPath = path.resolve(__dirname, "../src/images");
app.use("/photos", express.static(imagesPath, {
    setHeaders: (res) => {
        // CORS 헤더 추가
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}));

const roomRouter = require("./routes/roomRoute");
app.use("/room", roomRouter);

const memberRouter = require("./routes/memberRoute");
app.use("/member", memberRouter);

const uploadRouter = require("./routes/uploadRoute");
app.use("/upload", uploadRouter);

const deleteOldImages = () => {
    const imagesDir = path.join(__dirname, "images");
    const oneHourAgo = Date.now() - 600 * 1000;

    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error("Error reading images directory:", err);
            return;
        }

        files.forEach((file) => {
            // Check if the file has a .png or .jpg extension
            if (file.endsWith(".png") || file.endsWith(".jpg")) {
                const filePath = path.join(imagesDir, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        console.error("Error getting file stats:", err);
                        return;
                    }
                    // Delete the file if it's older than 10 minutes
                    if (stats.mtimeMs < oneHourAgo) {
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error("Error deleting file:", err);
                            } else {
                                console.log(`Deleted old image: ${file}`);
                            }
                        });
                    }
                });
            }
        });
    });
};


setInterval(deleteOldImages, 600 * 1000); // 10분 지난 파일 삭제

app.get("*", (_, res) => {
    res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
    console.log("server is running at 3001");
});
