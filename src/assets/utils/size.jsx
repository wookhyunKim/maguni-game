import React from 'react'

const size = () => {
    const video = document.getElementById('myVideo');
    const canvas = document.getElementById('zoomCanvas');
    const ctx = canvas.getContext('2d');

    // 확대할 영역의 크기와 위치
    const zoomWidth = 50; // 확대할 너비
    const zoomHeight = 50; // 확대할 높이
    const zoomX = 300; // 비디오에서의 x좌표
    const zoomY = 200; // 비디오에서의 y좌표

    // 웹캠 비디오 스트림 요청
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream; // 비디오 소스에 스트림 설정
            video.play(); // 비디오 재생
        })
        .catch(error => {
            console.error('웹캠 접근 오류:', error);
        });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전 프레임 지우기
        // 비디오의 특정 영역을 확대하여 캔버스에 그리기
        ctx.drawImage(video, zoomX, zoomY, zoomWidth, zoomHeight, 250, 150, zoomWidth * 2, zoomHeight * 2);
        requestAnimationFrame(draw); // 다음 프레임 요청
    }

    video.addEventListener('play', () => {
        draw(); // 비디오 재생 시 그리기 시작
    });
  return (

        <div class="video-container">
            <video id="myVideo" width="600" height="400" autoplay></video> 
            <canvas id="zoomCanvas" width="400" height="400"></canvas> 
        </div>

  )
}

export default size


