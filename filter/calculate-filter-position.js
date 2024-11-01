const facePoint = {
    leftEyeTop: 124,
    rightEyeTop: 276,
    leftEyeBottom: 111,
};

export function calculateFilterPosition(keypoints) {
    const xPadding = 30;
    const yPadding = 10;

    // keypoints 배열이 충분한 길이를 가지고 있는지 확인
    if (keypoints.length <= facePoint.leftEyeBottom) {
        console.error("keypoints 배열의 길이가 충분하지 않습니다.");
        return { x: 0, y: 0, width: 0, height: 0 }; // 기본값 반환
    }

    const x = keypoints[facePoint.leftEyeTop].x - xPadding;
    const y = keypoints[facePoint.leftEyeTop].y - yPadding;
    const width =
        keypoints[facePoint.rightEyeTop].x -
        keypoints[facePoint.leftEyeTop].x +
        xPadding * 2;
    const height =
        keypoints[facePoint.leftEyeBottom].y -
        keypoints[facePoint.leftEyeTop].y +
        yPadding * 2;

    console.log("x,y,w,h : ", x, y, width, height);
    return {
        x,
        y,
        width,
        height,
    };
}
