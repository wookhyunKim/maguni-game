import  { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import saveAs from "file-saver";
import Four from "../assets/utils/인생네컷_로고.png";
import GOONYE from "../assets/images/goongYeImage.png";
import axios from "axios";
import { useLocation } from "react-router-dom";
const TakePhotos = () => {
    const divRef = useRef(null);
    const canvasRef = useRef(null);
    const [imageList,setImageList] = useState([]);
    const location = useLocation();
    // const roomCode = location.state.roomCode;
    const sendImage= () =>{
        const date = new Date();
        const nowtime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
        if (divRef.current) {
            html2canvas(divRef.current).then(canvas => {
                const imageData = canvas.toDataURL("image/png",0.7);
                // 서버에 이미지 데이터 전송
                axios.post("http://localhost:3001/upload/api/v1", 
                    {
                        image: imageData,
                        filename : `SNT2SS_${nowtime}.png`
                    }
                ).then(response => {
                        console.log("Image saved on server:", response.data);
                    })
                    .catch(error => {
                        console.error("Error saving image:", error);
                    });
                });
        }
    };
    const recvImage = ()=>{
        const roomCode = "SNT2SS"
        return axios({
            method: "GET",
            url: `http://localhost:3001/upload/api/v1/${roomCode}`,
        }).then((res)=>{
            setImageList(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    }
    const handleDownload = async () => {
        if (!divRef.current) return;
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
        try {
            const canvas = await html2canvas(divRef.current, { scale: 2 });
            canvas.toBlob((blob) => {
                if (blob) {
                    saveAs(blob, `${formattedDate}.png`);
                }
            });
        } catch (error) {
            console.error("Error converting div to image:", error);
        }
    };
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const image = new Image();
        image.src = GOONYE;
        image.onload = () => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // 캔버스에 이미지 그리기
        };
    }, []);
    return (
        <>
            <div
                ref={divRef}
                style={{
                    backgroundColor: "lime",
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    position: "relative", // 부모 요소에 상대적 위치 설정
                }}
            >
                <img
                    src={Four}
                    alt="xxxxx"
                    style={{
                        width: "100%",
                        height: "auto",
                        position: "relative",
                        zIndex: 1,
                        border: "5px solid black",
                        borderRadius: "10px",
                    }} // 이미지의 z-index를 낮춰 캔버스 위로 오도록 설정
                />
                {/* 50x50 픽셀 캔버스 4개 배치 */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        width: "200px",
                        height: "200px",
                        backgroundColor: "rgba(255, 0, 0, 0.5)", // 반투명 빨간색 캔버스
                        top: "10%", // 상단에서 20px 떨어진 위치
                        left: "5%", // 좌측에서 20px 떨어진 위치
                        zIndex: 2, // 캔버스의 z-index를 높여 이미지 위로 오도록 설정
                    }}
                />
                <canvas
                    ref={canvasRef} // 캔버스 참조 추가
                    style={{
                        position: "absolute",
                        width: "200px",
                        height: "200px",
                        backgroundColor: "rgba(0, 100, 0, 0.5)", // 반투명 초록색 캔버스
                        top: "10%", // 상단에서 10% 떨어진 위치
                        right: "5%", // 우측에서 5% 떨어진 위치
                        zIndex: 2, // 캔버스의 z-index를 높여 이미지 위로 오도록 설정
                    }}
                    width={200} // 캔버스의 실제 너비
                    height={200} // 캔버스의 실제 높이
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        width: "200px",
                        height: "200px",
                        backgroundColor: "rgba(0, 0, 255, 0.5)", // 반투명 파란색 캔버스
                        bottom: "30%", // 상단에서 80px 떨어진 위치
                        right: "5%", // 좌측에서 20px 떨어진 위치
                        zIndex: 2, // 캔버스의 z-index를 높여 이미지 위로 오도록 설정
                    }}
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        width: "200px",
                        height: "200px",
                        backgroundColor: "rgba(255, 255, 0, 0.5)", // 반투명 노란색 캔버스
                        bottom: "30%", // 상단에서 80px 떨어진 위치
                        left: "5%", // 좌측에서 80px 떨어진 위치
                        zIndex: 2, // 캔버스의 z-index를 높여 이미지 위로 오도록 설정
                    }}
                />
            </div>
            <button onClick={handleDownload}>다운로드</button>
            <button onClick={sendImage}>Image to Server</button>
            <button onClick={recvImage}>Server to Image</button>
            <div>
            <h1>이미지 목록</h1>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {imageList.map((image, index) => (
                    <img
                        key={index}
                        src={`http://localhost:3001/images/${image}`}
                        alt={`이미지 ${index + 1}`}
                        style={{ width: "150px", height: "150px", margin: "10px" }}
                    />
                ))}
            </div>
        </div>
        </>
        
    );
};
export default TakePhotos