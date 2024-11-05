// ====================================================== 선글라스 벌칙 ====================================================== 
const penaltySunglasses = (videoElement,user)=>{
    if(!detectModel) {
        console.log("detect model is not loaded")
        return};

        const originCanvas = document.getElementById(`canvas_${user}`);

        const canvas = document.createElement("canvas");
        canvas.width = originCanvas.width;    // 픽셀 단위 캔버스 너비
        canvas.height = originCanvas.height;  // 픽셀 단위 캔버스 높이
    
        // CSS 스타일 크기를 Old와 동일하게 설정
        canvas.style.width = `${originCanvas.width}px`;
        canvas.style.height = `${originCanvas.height}px`;
        canvas.style.position = "absolute";
    
        // Old의 위치를 기반으로 top, left 설정
        const rect = originCanvas.getBoundingClientRect();
        canvas.style.top = `${rect.top}px`;
        canvas.style.left = `${rect.left}px`;
        canvas.style.zIndex = "10";
        const ctx = canvas.getContext("2d");
        
        originCanvas.parentNode.insertBefore(canvas, originCanvas.nextSibling);


        const image = new Image();
        image.src = SUNGLASS;



        const drawing=()=>{
            detectModel.estimateFaces(canvas).then((faces) => {
                ctx.clearRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                ctx.save();
                ctx.scale(-1, 1); // X축 반전
                ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                ctx.drawImage(
                    videoElement,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                if (faces[0]) {
                    const { x, y, width, height,angle } = calculateFilterPosition(
                        "eyeFilter",
                        faces[0].keypoints
                    );
                    ctx.scale(-1, 1); // X축 반전
                    ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                    ctx.save(); // 현재 캔버스 상태 저장
                    ctx.translate(x + width / 2, y + height / 2); // 필터 중심으로 이동
                    ctx.rotate(angle); // 얼굴 각도에 맞춰 회전
                    ctx.drawImage(image, -width / 2, -height / 2, width, height); // 중심을 기준으로 이미지 그리기
                    ctx.restore(); // 원래 캔버스 상태로 복원
                }
                ctx.restore();
                requestAnimationFrame(drawing);
            })
        }
        // ctx.restore();
        requestAnimationFrame(drawing);
        setTimeout(() => {
            canvas.remove(); 
        }, 3000);

}
const penaltyMustache = (videoElement,user)=>{
    if(!detectModel) {
        console.log("detect model is not loaded")
        return};

        const originCanvas = document.getElementById(`canvas_${user}`);
        const canvas = document.createElement("canvas");
        canvas.width = originCanvas.width;    // 픽셀 단위 캔버스 너비
        canvas.height = originCanvas.height;  // 픽셀 단위 캔버스 높이
    
        // CSS 스타일 크기를 Old와 동일하게 설정
        canvas.style.width = `${originCanvas.width}px`;
        canvas.style.height = `${originCanvas.height}px`;
        canvas.style.position = "absolute";
    
        // Old의 위치를 기반으로 top, left 설정
        const rect = originCanvas.getBoundingClientRect();
        canvas.style.top = `${rect.top}px`;
        canvas.style.left = `${rect.left}px`;
        canvas.style.zIndex = "10";
        const ctx = canvas.getContext("2d");
        
        originCanvas.parentNode.insertBefore(canvas, originCanvas.nextSibling);


        const image = new Image();
        image.src = MUSTACHE;



        const drawing=()=>{
            detectModel.estimateFaces(canvas).then((faces) => {
                ctx.clearRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                ctx.save();
                ctx.scale(-1, 1); // X축 반전
                ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                ctx.drawImage(
                    videoElement,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                if (faces[0]) {
                    const { x, y, width, height,angle } = calculateFilterPosition(
                        "mustacheFilter",
                        faces[0].keypoints
                    );
                    ctx.scale(-1, 1); // X축 반전
                    ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                    ctx.save(); // 현재 캔버스 상태 저장
                    ctx.translate(x + width / 2, y + height / 2); // 필터 중심으로 이동
                    ctx.rotate(angle); // 얼굴 각도에 맞춰 회전
                    ctx.drawImage(image, -width / 2 - 45, -height / 2, width, height); // 중심을 기준으로 이미지 그리기
                    ctx.restore(); // 원래 캔버스 상태로 복원
                }
                ctx.restore();
                requestAnimationFrame(drawing);
            })
        }
        requestAnimationFrame(drawing);
        setTimeout(() => {
            canvas.remove(); 
        }, 3000);

}
const penaltyExpansion = (videoElement,user)=>{
    if(!detectModel) {
        console.log("detect model is not loaded")
        return};

        const originCanvas = document.getElementById(`canvas_${user}`);
        const canvas = document.createElement("canvas");
        canvas.width = originCanvas.width;    // 픽셀 단위 캔버스 너비
        canvas.height = originCanvas.height;  // 픽셀 단위 캔버스 높이
    
        // CSS 스타일 크기를 Old와 동일하게 설정
        canvas.style.width = `${originCanvas.width}px`;
        canvas.style.height = `${originCanvas.height}px`;
        canvas.style.position = "absolute";
    
        // Old의 위치를 기반으로 top, left 설정
        const rect = originCanvas.getBoundingClientRect();
        canvas.style.top = `${rect.top}px`;
        canvas.style.left = `${rect.left}px`;
        canvas.style.zIndex = "10";
        const ctx = canvas.getContext("2d");
        
        originCanvas.parentNode.insertBefore(canvas, originCanvas.nextSibling);

        const drawing=()=>{
            detectModel.estimateFaces(canvas).then((faces) => {
                ctx.clearRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                ctx.save();
                ctx.scale(-1, 1); // X축 반전
                ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                ctx.drawImage(
                    videoElement,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                if (faces[0]) {
                    const { x, y, width, height } = calculateFilterPosition(
                        "lefteyeFilter",
                        faces[0].keypoints
                    );
                    ctx.scale(-1, 1); // X축 반전
                    ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                    ctx.drawImage(canvas, x+10, y, width, height, x-30, y, width * 3, height * 3);
                }
                ctx.restore();
                requestAnimationFrame(drawing);
            })
        }
        requestAnimationFrame(drawing);
        setTimeout(() => {
            canvas.remove(); 
        }, 3000);
}

const penaltyBald = (videoElement,user)=>{
    if(!detectModel) {
        console.log("detect model is not loaded")
        return};

        const originCanvas = document.getElementById(`canvas_${user}`);
        const canvas = document.createElement("canvas");
        canvas.width = originCanvas.width;    // 픽셀 단위 캔버스 너비
        canvas.height = originCanvas.height;  // 픽셀 단위 캔버스 높이
    
        // CSS 스타일 크기를 Old와 동일하게 설정
        canvas.style.width = `${originCanvas.width}px`;
        canvas.style.height = `${originCanvas.height}px`;
        canvas.style.position = "absolute";
    
        // Old의 위치를 기반으로 top, left 설정
        const rect = originCanvas.getBoundingClientRect();
        canvas.style.top = `${rect.top}px`;
        canvas.style.left = `${rect.left}px`;
        canvas.style.zIndex = "10";
        const ctx = canvas.getContext("2d");
        
        originCanvas.parentNode.insertBefore(canvas, originCanvas.nextSibling);


        const image = new Image();
        image.src = BALD;



        const drawing=()=>{
            detectModel.estimateFaces(canvas).then((faces) => {
                ctx.clearRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                ctx.save();
                ctx.scale(-1, 1); // X축 반전
                ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                ctx.drawImage(
                    videoElement,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                if (faces[0]) {
                    const { x, y, width, height } = calculateFilterPosition(
                        "baldFilter",
                        faces[0].keypoints
                    );
                    ctx.scale(-1, 1); // X축 반전
                    ctx.translate(-canvas.width, 0); // 캔버스의 왼쪽 끝으로 이동
                    ctx.drawImage(image, x, y, width, height);
                }
                ctx.restore();
                requestAnimationFrame(drawing);
            })
        }
        requestAnimationFrame(drawing);
        setTimeout(() => {
            canvas.remove(); 
        }, 3000);

}