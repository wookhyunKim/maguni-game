import {create} from 'zustand';

export const UsePlayerStore = create((set) => ({
    
    // 현재 플레이어 닉네임값/설정하기
    username:'',
    setUsername: (newUsername) => set({ username: newUsername }),

    // 현재 플레이어 인덱스값/설정하기
    userIndex:-1,
    setUserIndex: (newUserIndex) => set({ userIndex: newUserIndex }),

    userRole:'',
    setUserRole: (newUserRole) => set({ userRole: newUserRole }),


    
    //대기방에서 돌담 안에 있는 유저 리스트
    userList: [],
    setUserList: (newUserList) => set({ userList: newUserList }),

    

}))

export default UsePlayerStore;
