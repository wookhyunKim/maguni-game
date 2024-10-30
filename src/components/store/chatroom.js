// // ChatRoom.js
// import { useChatStore } from './store';

// export const ChatRoom = () => {
//   const { 
//     localUser, 
//     room,
//     toggleAudio, 
//     toggleVideo,
//     updateParticipantMedia 
//   } = useChatStore();
  
//   const localVideoRef = useRef(null);
  
//   // 로컬 비디오 스트림 설정
//   useEffect(() => {
//     if (localUser?.stream && localVideoRef.current) {
//       localVideoRef.current.srcObject = localUser.stream;
//     }
//   }, [localUser?.stream]);
  
//   // 미디어 스트림 초기화
//   useEffect(() => {
//     const initializeMedia = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true
//         });
//         useChatStore.getState().setLocalStream(stream);
//       } catch (error) {
//         console.error('Error accessing media devices:', error);
//       }
//     };
    
//     initializeMedia();
    
//     // 클린업
//     return () => {
//       const { localUser } = useChatStore.getState();
//       localUser?.stream?.getTracks().forEach(track => track.stop());
//     };
//   }, []);

//   return (
//     <div className="chat-room">
//       {/* 로컬 비디오 */}
//       <div className="local-video">
//         <video
//           ref={localVideoRef}
//           autoPlay
//           muted
//           playsInline
//         />
//         <div className="controls">
//           <button onClick={toggleAudio}>
//             {localUser?.isAudioEnabled ? '음소거' : '음소거 해제'}
//           </button>
//           <button onClick={toggleVideo}>
//             {localUser?.isVideoEnabled ? '비디오 끄기' : '비디오 켜기'}
//           </button>
//         </div>
//       </div>

//       {/* 참가자 비디오들 */}
//       <div className="remote-videos">
//         {room?.participants.map(participant => (
//           <div key={participant.id} className="remote-video">
//             <video
//               autoPlay
//               playsInline
//               ref={el => {
//                 if (el && participant.stream) {
//                   el.srcObject = participant.stream;
//                 }
//               }}
//             />
//             <div className="participant-name">{participant.name}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // 시그널링 관리
// export const initializeSignaling = (socket) => {
//   const store = useChatStore.getState();
  
//   // 새로운 참가자 입장
//   socket.on('user-joined', async (userId) => {
//     const peerConnection = store.createPeerConnection(userId);
    
//     // 로컬 스트림 추가
//     if (store.localUser?.stream) {
//       store.localUser.stream.getTracks().forEach(track => {
//         peerConnection.addTrack(track, store.localUser.stream);
//       });
//     }
    
//     // Offer 생성 및 전송
//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);
//     socket.emit('offer', { userId, offer });
//   });
  
//   // Offer 수신
//   socket.on('offer', async ({ userId, offer }) => {
//     const peerConnection = store.createPeerConnection(userId);
//     await peerConnection.setRemoteDescription(offer);
    
//     // Answer 생성 및 전송
//     const answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(answer);
//     socket.emit('answer', { userId, answer });
//   });
  
//   // Answer 수신
//   socket.on('answer', async ({ userId, answer }) => {
//     const peerConnection = store.peers.get(userId);
//     if (peerConnection) {
//       await peerConnection.setRemoteDescription(answer);
//     }
//   });
  
//   // ICE candidate 교환
//   socket.on('ice-candidate', async ({ userId, candidate }) => {
//     const peerConnection = store.peers.get(userId);
//     if (peerConnection) {
//       await peerConnection.addIceCandidate(candidate);
//     }
//   });
  
//   // 참가자 퇴장
//   socket.on('user-left', (userId) => {
//     store.removePeerConnection(userId);
//     store.removeParticipant(userId);
//   });
// };

// import {create} from 'zustand';

