import { UsePlayerStore } from "../../components/store/playerStore";




// export const gameStart = () => {
//     //1. 현재 플레이어의 인덱스값 찾아야 ....=> 금칙어 순서 설정 가능
//     find_my_index();
// }


export const find_my_index = (username) => {
    // store에서 현재 상태와 설정 함수를 가져오기
    const userList = UsePlayerStore.getState().userList;
    const setUserIndex = UsePlayerStore.getState().setUserIndex;

    console.log("현재 유저리스트:", userList);  // 디버깅용
    console.log("찾고있는 유저네임:", username);  // 디버깅용

    // 유저리스트에서 현재 유저의 인덱스 찾기
    const newIndex = userList.findIndex((player) => player.username === username);
    
    console.log("찾은 인덱스:", newIndex);  // 디버깅용

    // userIndex 설정하기
    setUserIndex(newIndex);
    
    return newIndex;  // 리턴값 추가
}
