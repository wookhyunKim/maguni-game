const eyePoint = {
  leftEyeTop: 124,
  rightEyeTop: 276,
  leftEyeBottom: 111,
};

const facePoint = {
  leftSideTop: 54,    // 왼쪽 귀 윗부분에 해당하는 인덱스
  leftSideBottom: 36, // 왼쪽 귀 아랫부분에 해당하는 인덱스
  rightSideTop: 4,     // 오른쪽 귀 윗부분에 해당하는 인덱스
  rightSideBottom: 284 // 오른쪽 귀 아랫부분에 해당하는 인덱스
}

const mustachePoint = {
  noseBelowCenterPoint : 164,
  noseBelowLeftPoint : 216,
  noseBelowRightPoint : 436,
}

const leftEye = {
  left: 130,
  right: 244,
  top: 159,
  bottom: 145,
}

const baldPoint = {
  left:162,
  right:389,
  top:10,
  down:197
};

const foreHeadPoint = {
  foreHeadLeft: 105,      // 이마의 왼쪽
  foreHeadRight: 334,     // 이마의 오른쪽
  foreHeadTop: 10,        // 이마의 위쪽 (정수리 가까운 위치)
  foreHeadBottom: 151     // 이마의 아래쪽 (눈썹 위 정도 위치)
};

export function calculateFilterPosition(type,keypoints) {
  
  switch(type){
    case "eyeFilter":
      return calculateEyeFilterPosition(keypoints);
    case "faceFilter":
      return calculateFaceFilterPosition(keypoints);
    case "mustacheFilter":
      return calculateNoseFilterPosition(keypoints);
    case "lefteyeFilter":
      return calculateLeftEyeFilterPosition(keypoints);
    case "baldFilter":
      return calculateBaldFilterPosition(keypoints);
    case "foreHead":
      return calculateForeHeadBaldFilterPosition(keypoints);
    default:
      return calculateLeftEyeFilterPosition(keypoints);
  }
}

function calculateLeftEyeFilterPosition(keypoints){
  const xPadding = 40;
  const yPadding = 20;

  const leftEyeLeft = keypoints[leftEye.left];
  const leftEyeRight = keypoints[leftEye.right];
  const leftEyeTop = keypoints[leftEye.top];
  const leftEyeBottom = keypoints[leftEye.bottom];


  const x = leftEyeTop.x - xPadding;
  const y = leftEyeTop.y - yPadding;
  const width = leftEyeRight.x - leftEyeLeft.x  ;
  const height = leftEyeBottom.y - leftEyeTop.y + 20;
  // 회전 각도 계산
  // const angle = Math.atan2(rightEyeTop.y - leftEyeTop.y, rightEyeTop.x - leftEyeTop.x);

  return { x, y, width, height };
}

function calculateForeHeadBaldFilterPosition(keypoints) {
  const xPadding = 30; // Adjust padding as needed
  const yPadding = 20; // Adjust padding as needed

  // Use forehead points to define the overlay position and size
  const foreHeadLeft = keypoints[foreHeadPoint.foreHeadLeft];
  const foreHeadRight = keypoints[foreHeadPoint.foreHeadRight];
  const foreHeadTop = keypoints[foreHeadPoint.foreHeadTop];
  const foreHeadBottom = keypoints[foreHeadPoint.foreHeadBottom];

  // const x = foreHeadLeft.x - xPadding;
  // const y = foreHeadTop.y - yPadding;
  // const width = foreHeadRight.x - foreHeadLeft.x + xPadding * 2;
  // const height = foreHeadBottom.y - foreHeadTop.y + yPadding * 2;

  const x = (foreHeadLeft.x + foreHeadRight.x) / 2;
   const y = (foreHeadTop.y + foreHeadBottom.y) / 2 - 30;
   const width = (foreHeadRight.x - foreHeadLeft.x) * 1.2;
   const height = (foreHeadBottom.y - foreHeadTop.y) * 0.8;

  // You may want to add an angle if the face is slightly tilted
  const angle = Math.atan2(foreHeadRight.y - foreHeadLeft.y, foreHeadRight.x - foreHeadLeft.x);

  return { x, y, width, height, angle };
}

function calculateBaldFilterPosition(keypoints){
  const x = keypoints[baldPoint.left].x -30;
  const y = keypoints[baldPoint.right].y +40;
  const width =
    (keypoints[baldPoint.right].x -
    keypoints[baldPoint.left].x)*1.5 - 10
  const height =
    (keypoints[baldPoint.top].y -
    keypoints[baldPoint.down].y) * 2 - 30

  return { x, y, width, height };
}

function calculateEyeFilterPosition(keypoints){
  const xPadding = 40;
  const yPadding = 20;

  const leftEyeTop = keypoints[eyePoint.leftEyeTop];
  const rightEyeTop = keypoints[eyePoint.rightEyeTop];
  const leftEyeBottom = keypoints[eyePoint.leftEyeBottom];

  const x = leftEyeTop.x - xPadding;
  const y = leftEyeTop.y - yPadding;
  const width = rightEyeTop.x - leftEyeTop.x + xPadding * 2;
  const height = leftEyeBottom.y - leftEyeTop.y + yPadding * 2;

  // 회전 각도 계산
  const angle = Math.atan2(rightEyeTop.y - leftEyeTop.y, rightEyeTop.x - leftEyeTop.x);

  return { x, y, width, height, angle };
}
function calculateNoseFilterPosition(keypoints){
  const xPadding = 20;
  const yPadding = 20;

  const xOffset = -45;

  const noseCenter = keypoints[mustachePoint.noseBelowCenterPoint];
  const noseLeft = keypoints[mustachePoint.noseBelowLeftPoint];
  const noseRight = keypoints[mustachePoint.noseBelowRightPoint];

  const x = noseCenter.x + xOffset - xPadding;
  const y = noseCenter.y - yPadding;
  const width = noseRight.x - noseLeft.x + xPadding * 2;
  const height = noseLeft.y - noseCenter.y + yPadding * 2;

  // 회전 각도 계산
  const angle = Math.atan2(noseRight.y - noseLeft.y, noseRight.x - noseLeft.x);

  return { x, y, width, height,angle };
}

function calculateFaceFilterPosition(keypoints) {
  // 필터의 여백을 조정하기 위한 패딩 값
  const xPadding = 50;
  const yPadding = 50;

  // 얼굴의 각 귀 위치를 기준으로 좌표 설정
  const leftSideTop = keypoints[facePoint.leftSideTop];
  const leftSideBottom = keypoints[facePoint.leftSideBottom];
  const rightSideTop = keypoints[facePoint.rightSideTop];
  const rightSideBottom = keypoints[facePoint.rightSideBottom];

  // 얼굴의 상단과 하단 중앙을 기준으로 필터 위치 및 크기 설정
  const x = leftSideTop.x - xPadding;
  const y = Math.min(leftSideTop.y, rightSideTop.y) - yPadding;
  const width = (rightSideTop.x - leftSideTop.x) + xPadding * 2;
  const height = Math.max(leftSideBottom.y, rightSideBottom.y) - Math.min(leftSideTop.y, rightSideTop.y) + yPadding * 2;

  // 얼굴 각도에 따라 필터를 회전시키기 위한 각도 계산
  const angle = Math.atan2(rightSideTop.y - leftSideTop.y, rightSideTop.x - leftSideTop.x);
  //const angle = 0;

  return { x, y, width, height, angle };
}