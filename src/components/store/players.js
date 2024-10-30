import {create} from 'zustand';

// 플레이어 관련 상태

// 현재 플레이어 정보
// 각 플레이어 정보(닉네임, ID, 순서)
// 플레이어별 금칙어 목록
// 플레이어별 필터 상태
// 마이크 on, off 상태
// 보상 카드 보유 현황

export const usePlayerStore = create((set) => ({
    // 현재 플레이어 설정
    curPlayer: {
        nickname: '',
        isHost : false,
    },

    //닉네임설정
    setNickname: (input_nickname) => set((state)=>({
        curPlayer: {
            ...state.curPlayer,
            nickname:input_nickname
        }
    })),

    //호스트 여부설정
    setIsHost: () => set((state)=>({
        curPlayer: {
            ...state.curPlayer,
            isHost : true
        }
    })),

    // 플레이어 리스트
    players : {},

    //플레이어 추가 : val은 nickname
    addPlayer: (nick_name) => set((state)=>({
        playerList : {
            ...state.playerList,
            playerNum:'', 
            nickname :nick_name, 
            filter : [], 
            mike :true, 
            sound :true, 
            rewardcards:[]
        }
    })),
    
    // //플레이어 삭제 : val은 playerId
    // deletePlayer: (playerId) => set((state)=>{
    //     const newPlayerList = [...state.players];
    //     delete newPlayerList[playerId];
    //     playerList : [...prev.playerList, {playerNum: (prev.playerList.length)+1, nicknmae:val}];

    // }),

    //플레이어 

}))

