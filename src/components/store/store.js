import {create} from 'zustand';

export const Globalstore = create((set) => ({
    //전반적인 진행 상태 정보

    // 방 정보 (roomId, 참가자 목록, 호스트 여부)
    // 현재의 게임 단계 (홈화면, 대기실, 금칙어 설정 단계, 게임 진행 중, 피버타임, 결과화면)
    // 타이머 상태(남은 시간)
    // 게임 진행 시간 
    roomId: '',//is host 인경우, 아닌 경우에 따라서 다르게 
    curPlayerId:0,//host인 경우, 방만들기 하면 정해지고 서버에 아이디/방번호 보내기, 
    curPlayerNickname:'',//desktop2에서 설정
    gameStage: 'setting',//'waiting'|'playing'|'fever'|'breaktime'...페이지 이동시마다 달라짐

    setroomId:(val) =>set(()=>(val)),
    setCurPlayerId:(val) =>set(()=>(val)),
    setPlayerNickname: (val) =>set(()=>(val)),


    // 플레이어 관련 상태

    // 현재 플레이어 정보
    // 각 플레이어 정보(닉네임, ID, 순서)
    // 플레이어별 금칙어 목록
    // 플레이어별 필터 상태
    // 마이크 on, off 상태
    // 보상 카드 보유 현황
    currentPlayer:'',//desktop 6에서 버튼 클릭시, 브라우저에 저장
    isHost: false,//desktop 7에서 '방 만들기' 버튼 누를 때
    forbiddenWords:[null],
    mymission:[null],

    roomList : [],
    addPlayer:(val) => set((prev) =>({
        playerList: [...prev.playerList, {playerNum: (prev.playerList.length)+1, nickname:val}]
    }))

}));
