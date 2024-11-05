import $ from 'jquery';
import { OpenVidu } from 'openvidu-browser';
import {calculateFilterPosition} from '../filter/calculate-filter-position.ts';
import { loadDetectionModel } from '../filter/load-detection-model.js';
import SUNGLASS from "../src/assets/images/sunglasses.png";
import MUSTACHE from "../src/assets/images/mustache.png";
import MUMURI from "../src/assets/images/mumuri.png";
import DISH from "../src/assets/images/dish.png";


var OV;
var session;
export var subscribers = [];
var FRAME_RATE = 30;


/* OPENVIDU METHODS */

export function joinSession(mySessionId,myUserName) {

   // --- 1) Get an OpenVidu object ---

   OV = new OpenVidu();

   // --- 2) Init a session ---

   session = OV.initSession();

   // --- 3) Specify the actions when events take place in the session ---

   // On every new Stream received...
   session.on('streamCreated', event => {

      // Subscribe to the Stream to receive it. HTML video will be appended to element with 'video-container' id
      //let subscriber = session.subscribe(event.stream, 'video-container');

      //등록하되 생성하진 않음
      let subscriber = session.subscribe(event.stream, 'video-container');

      subscribers = [...subscribers,subscriber];

      //const videoContainer = document.getElementById('video-container');


      // When the HTML video has been appended to DOM...
      subscriber.on('videoElementCreated', event => {
      //    // 비디오 element가 생성될 때 해당 element를 반환하여 GameRoomPage.jsx에서 필터링 처리
      //   const videoElement = event.element;
      //   // 이벤트 발생 시 videoElement를 콜백으로 호출
      //   handleVideoElementCreated(videoElement, subscriber.stream.connection);

         // Add a new <p> element for the user's nickname just below its video
         appendUserData(event.element, subscriber.stream.connection);
      });
   });

   // On every Stream destroyed...
   session.on('streamDestroyed', event => {

      // Delete the HTML element with the user's nickname. HTML videos are automatically removed from DOM
      removeUserData(event.stream.connection);

      subscribers.filter((sub) =>
      sub !== event.stream.streamManager);
   });

   // On every asynchronous exception...
   session.on('exception', (exception) => {
      console.warn(exception);
   });


   // --- 4) Connect to the session with a valid user token ---

   // Get a token from the OpenVidu deployment
   getToken(mySessionId).then(token => {

      // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      session.connect(token, { clientData: myUserName })
         .then(() => {
            OV.getUserMedia({
               audioSource: false,
               videoSource: undefined,
               // resolution: '1280x720',
               resolution: '640x480',
               frameRate: FRAME_RATE,
            }).then((mediaStream) =>{
               startStreaming(session,OV,mediaStream);
            });

            // --- 5) Set page layout for active call ---

            document.getElementById('session-title').innerText = mySessionId;
            document.getElementById('join').style.display = 'none';
            document.getElementById('session').style.display = 'block';

         })
         .catch(error => {
            console.log('There was an error connecting to the session:', error.code, error.message);
         });
   });
}

const startStreaming = async (session, OV, mediaStream) => {
   // 2초 대기
   await new Promise((resolve) => setTimeout(resolve, 2000));

   const video = document.createElement('video');
   video.srcObject = mediaStream;
   video.autoplay = true;
   video.playsInline = true;

   const compositeCanvas = document.createElement('canvas');
   compositeCanvas.width = 640;
   compositeCanvas.height = 480;
   const ctx = compositeCanvas.getContext('2d');
   let animationFrameID;

// 이미지와 필터 타입 배열
const filters = [
   { image: new Image(), type: "eyeFilter" },
   { image: new Image(), type: "mustacheFilter" },
   { image: new Image(), type: "baldFilter" },
   { image: new Image(), type: "fallingImage" }
 ];
 filters[0].image.src = SUNGLASS;
 filters[1].image.src = MUSTACHE;
 filters[2].image.src = MUMURI;
 filters[3].image.src = DISH;
 
 let activeFilters = [];

 // 얼굴 위치와 함께 이미지 애니메이션 추가
const IMG_WIDTH = 200;
const IMG_HEIGHT = 120;
let yPosition = -IMG_HEIGHT; // 초기 y 위치 설정
const targetY = 100; // 목표 위치 (적절히 조정 필요)


 // 기존 필터 함수와 별개로 애니메이션을 위한 함수
function animateImage(ctx, x, yPosition) {
   ctx.drawImage(filters[3].image, x - IMG_WIDTH / 2, yPosition, IMG_WIDTH, IMG_HEIGHT);
}
 
 const startFiltering = () => {
   loadDetectionModel().then((model) => {
     const addFilter = (filter) => {
       const newFilter = { ...filter, yPosition: -IMG_HEIGHT, timeoutId: null };
 
       // 타이머가 만료되면 필터를 제거
       newFilter.timeoutId = setTimeout(() => {
         activeFilters = activeFilters.filter((f) => f !== newFilter);
       }, 2000);
 
       activeFilters.push(newFilter);
     };
 
     const handleStartPenaltyFilter = () => {
       const nextFilter = filters[activeFilters.length % filters.length];
       addFilter(nextFilter);
     };
 
     window.addEventListener('startPenaltyFilter', handleStartPenaltyFilter);
 
     const estimateFacesLoop = () => {
       model.estimateFaces(compositeCanvas).then((faces) => {
         ctx.clearRect(0, 0, compositeCanvas.width, compositeCanvas.height);
         ctx.drawImage(video, 0, 0, compositeCanvas.width, compositeCanvas.height);
 
         if (faces[0]) {
           activeFilters.forEach((filter) => {
            if(filter.type !== "fallingImage"){
               const { x, y, width, height, angle } = calculateFilterPosition(filter.type, faces[0].keypoints);
 
               ctx.save();
               ctx.translate(x + width / 2, y + height / 2);
               ctx.rotate(angle);
               ctx.drawImage(filter.image, -width / 2, -height / 2, width, height);
               ctx.restore();
            }
            else{
               const {x,y} = calculateFilterPosition(filter.type,faces[0].keypoints);
               if (filter.yPosition < y) {
                  filter.yPosition += 5; // 떨어지는 속도 조절
            }
            animateImage(ctx, x, filter.yPosition);
            }
           });
         }
 
         requestAnimationFrame(estimateFacesLoop);
       });
     };
 
     requestAnimationFrame(estimateFacesLoop);
   });
 };

   // 비디오 메타데이터 로드 시 실행
   await new Promise((resolve) => {
       video.onloadedmetadata = () => {
           video.play();
           startFiltering();
           resolve();
       };
   });

   // 캔버스에서 스트림 생성
   const compositeStream = compositeCanvas.captureStream(FRAME_RATE);
   const publisher = OV.initPublisher(undefined, {
       audioSource: mediaStream.getAudioTracks()[0],
       videoSource: compositeStream.getVideoTracks()[0],
       frameRate: FRAME_RATE,
       videoCodec: 'H264',
   });

   await session.publish(publisher);

   // 캔버스를 화면에 추가
   const videoContainer = document.getElementById('video-container');
   videoContainer.appendChild(compositeCanvas);

   // 컴포넌트 언마운트 시 정리 함수 반환
   return () => {
       if (animationFrameID) {
           cancelAnimationFrame(animationFrameID);
       }
   };
};

export function leaveSession() {

   // --- 9) Leave the session by calling 'disconnect' method over the Session object ---

   session.disconnect();

   // Removing all HTML elements with user's nicknames.
   // HTML videos are automatically removed when leaving a Session
   removeAllUserData();

   // Back to 'Join session' page
   document.getElementById('join').style.display = 'block';
   document.getElementById('session').style.display = 'none';
}

window.onbeforeunload = function () {
   if (session) session.disconnect();
};

function appendUserData(videoElement, connection) {
   var userData;
   var nodeId;
   if (typeof connection === "string") {
      userData = connection;
      nodeId = connection;
   } else {
      userData = JSON.parse(connection.data).clientData;
      nodeId = connection.connectionId;
   }
   var dataNode = document.createElement('div');
   dataNode.className = "data-node";
   dataNode.id = "data-" + nodeId;
   dataNode.innerHTML = "<p>" + userData + "</p>";
   videoElement.parentNode.insertBefore(dataNode, videoElement.nextSibling);
   addClickListener(videoElement, userData);
}

function removeUserData(connection) {
   var dataNode = document.getElementById("data-" + connection.connectionId);
   dataNode.parentNode.removeChild(dataNode);
}

function removeAllUserData() {
   var nicknameElements = document.getElementsByClassName('data-node');
   while (nicknameElements[0]) {
      nicknameElements[0].parentNode.removeChild(nicknameElements[0]);
   }
}

function addClickListener(videoElement, userData) {
   videoElement.addEventListener('click', function () {
      var mainVideo = $('#main-video video').get(0);
      if (mainVideo.srcObject !== videoElement.srcObject) {
         $('#main-video').fadeOut("fast", () => {
            $('#main-video p').html(userData);
            mainVideo.srcObject = videoElement.srcObject;
            $('#main-video').fadeIn("fast");
         });
      }
   });
}


/**
 * --------------------------------------------
 * GETTING A TOKEN FROM YOUR APPLICATION SERVER
 * --------------------------------------------
 * The methods below request the creation of a Session and a Token to
 * your application server. This keeps your OpenVidu deployment secure.
 *
 * In this sample code, there is no user control at all. Anybody could
 * access your application server endpoints! In a real production
 * environment, your application server must identify the user to allow
 * access to the endpoints.
 *
 * Visit https://docs.openvidu.io/en/stable/application-server to learn
 * more about the integration of OpenVidu in your application server.
 */

var APPLICATION_SERVER_URL = "https://mmyopenvidu.onrender.com/";

function getToken(mySessionId) {
   return createSession(mySessionId).then(sessionId => createToken(sessionId));
}

function createSession(sessionId) {
   return new Promise((resolve, reject) => {
      $.ajax({
         type: "POST",
         url: APPLICATION_SERVER_URL + "api/sessions",
         data: JSON.stringify({ customSessionId: sessionId }),
         headers: { "Content-Type": "application/json" },
         success: response => resolve(response), // The sessionId
         error: (error) => reject(error)
      });
   });
}

function createToken(sessionId) {
   return new Promise((resolve, reject) => {
      $.ajax({
         type: 'POST',
         url: APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections',
         data: JSON.stringify({}),
         headers: { "Content-Type": "application/json" },
         success: (response) => resolve(response), // The token
         error: (error) => reject(error)
      });
   });
}