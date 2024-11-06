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
        origin: ["https://main.maguni-game.com","https://43.202.180.250:3001"], // 특정 도메인만 허용
        methods: ["GET", "POST", "PATCH", "DELETE"], // 특정 HTTP 메서드만 허용
        credentials: true, // 쿠키 공유가 필요한 경우 설정
    })
);

const PORT = 3001;

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/images", express.static(path.join(__dirname, "images")));

const roomRouter = require("./routes/roomRoute");
app.use("/room", roomRouter);

const memberRouter = require("./routes/memberRoute");
app.use("/member", memberRouter);

const uploadRouter = require("./routes/uploadRoute");
app.use("/upload", uploadRouter);

// Function to delete old images
const deleteOldImages = () => {
    const imagesDir = path.join(__dirname, "images");
    const oneHourAgo = Date.now() - 600 * 1000;

    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error("Error reading images directory:", err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(imagesDir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error("Error getting file stats:", err);
                    return;
                }
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
