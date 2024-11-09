// const eyePoint = {
//   leftEyeTop: 124,
//   rightEyeTop: 276,
//   leftEyeBottom: 111,
// };

const eyePoint = {
  leftEyeTop: 53,
  rightEyeTop: 295,
  leftEyeBottom: 25,
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

const mouthPoint = {
  mouthTop:0,
  mouthBottom:17,
  mouthLeft:61,
  mouthRight:291,
}

const faceOutlinePoint = {
  leftSideTop:234,
  rightSideTop:454,
  foreHeadTop:10,
  mouthButtom:152,
}

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
    case "mouthFilter":
      return calculateMouthFilterPosition(keypoints);
      case "faceOutlineFilter":
        return calculateFaceOutlineFilterPosition(keypoints);
    default:
      return calculateLeftEyeFilterPosition(keypoints);
  }
}

function calculateMouthFilterPosition(keypoints) {
  const xPadding = 20; // Adjust padding for width as needed
  const yPadding = 10; // Adjust padding for height as needed
  const widthScaleFactor = 1.2; // Scale factor for the filter width
  const heightScaleFactor = 1.3; // Scale factor for the filter height

  const mouthTop = keypoints[mouthPoint.mouthTop];
  const mouthBottom = keypoints[mouthPoint.mouthBottom];
  const mouthLeft = keypoints[mouthPoint.mouthLeft];
  const mouthRight = keypoints[mouthPoint.mouthRight];

  // Calculate x and y positions
  const x = mouthLeft.x - xPadding - 10;
  const y = mouthTop.y - yPadding - 10;

  // Calculate width and height of the mouth filter, applying scaling factors
  const width = (mouthRight.x - mouthLeft.x + xPadding * 2) * widthScaleFactor;
  const height = (mouthBottom.y - mouthTop.y + yPadding * 2) * heightScaleFactor;

  // Calculate rotation angle if needed
  const angle = Math.atan2(mouthRight.y - mouthLeft.y, mouthRight.x - mouthLeft.x);

  return { x, y, width, height, angle };
}

function calculateFaceOutlineFilterPosition(keypoints) {
  // 얼굴의 좌우, 상하를 정의하는 좌표
  const leftSide = keypoints[faceOutlinePoint.leftSideTop];
  const rightSide = keypoints[faceOutlinePoint.rightSideTop];
  const topSide = keypoints[faceOutlinePoint.foreHeadTop];
  const bottomSide = keypoints[faceOutlinePoint.mouthButtom];

  // 얼굴의 중앙 위치 계산
  const centerX = (leftSide.x + rightSide.x) / 2;
  const centerY = (topSide.y + bottomSide.y) / 2;

    // 얼굴 너비와 높이를 스케일링하여 확대
    const widthScaleFactor = 2; // 너비 스케일
    const heightScaleFactor = 2.4; // 높이 스케일

  // 얼굴 너비와 높이를 계산
  const width = (rightSide.x - leftSide.x) * widthScaleFactor;
  const height = (bottomSide.y - topSide.y) * heightScaleFactor

  // 이미지의 위치를 얼굴 중앙에 맞추기 위해 x와 y 값을 조정
  const x = centerX - width / 2;
  const y = centerY - height / 2 + 30;

  return { x, y, width, height };
}


function calculateLeftEyeFilterPosition(keypoints){
  const xPadding = 40;
  const yPadding = -30;

  const leftEyeLeft = keypoints[leftEye.left];
  const leftEyeRight = keypoints[leftEye.right];
  const leftEyeTop = keypoints[leftEye.top];
  const leftEyeBottom = keypoints[leftEye.bottom];


  const x = leftEyeTop.x - xPadding;
  const y = leftEyeTop.y - yPadding + 20;
  const width = leftEyeRight.x - leftEyeLeft.x  ;
  const height = leftEyeBottom.y - leftEyeTop.y + 20;
  // 회전 각도 계산
  // const angle = Math.atan2(rightEyeTop.y - leftEyeTop.y, rightEyeTop.x - leftEyeTop.x);

  return { x, y , width, height };
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
  const x = keypoints[baldPoint.left].x - 35;
  const y = keypoints[baldPoint.right].y + 40;
  const width =
    (keypoints[baldPoint.right].x -
    keypoints[baldPoint.left].x)*1.5 - 10
  const height =
    (keypoints[baldPoint.top].y -
    keypoints[baldPoint.down].y) * 2 - 30

  return { x, y, width, height };
}

function calculateEyeFilterPosition(keypoints) {
  const xPadding = 5; // Adjusted padding for better centering
  const yPadding = 35;
  const widthScaleFactor = 1.3; // Separate scale factor for width
  const heightScaleFactor = 1.4; // Separate scale factor for height

  const leftEyeTop = keypoints[eyePoint.leftEyeTop];
  const rightEyeTop = keypoints[eyePoint.rightEyeTop];
  const leftEyeBottom = keypoints[eyePoint.leftEyeBottom];

  // Adjusting the x and y position to fine-tune centering
  const x = leftEyeTop.x - xPadding;
  const y = leftEyeTop.y - yPadding;

  // Applying separate scale factors to width and height
  const width = (rightEyeTop.x - leftEyeTop.x + xPadding * 2) * widthScaleFactor;
  const height = (leftEyeBottom.y - leftEyeTop.y + yPadding * 2) * heightScaleFactor;

  // Calculate angle for rotation, if needed
  const angle = Math.atan2(rightEyeTop.y - leftEyeTop.y, rightEyeTop.x - leftEyeTop.x);

  return { x, y, width, height, angle };
}

// function calculateEyeFilterPosition(keypoints){
//   const xPadding = 40;
//   const yPadding = 20;

//   const leftEyeTop = keypoints[eyePoint.leftEyeTop];
//   const rightEyeTop = keypoints[eyePoint.rightEyeTop];
//   const leftEyeBottom = keypoints[eyePoint.leftEyeBottom];

//   const x = leftEyeTop.x - xPadding;
//   const y = leftEyeTop.y - yPadding;
//   const width = rightEyeTop.x - leftEyeTop.x + xPadding * 2;
//   const height = leftEyeBottom.y - leftEyeTop.y + yPadding * 2;

//   // 회전 각도 계산
//   const angle = Math.atan2(rightEyeTop.y - leftEyeTop.y, rightEyeTop.x - leftEyeTop.x);

//   return { x, y, width, height, angle };
// }
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