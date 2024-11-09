import { UsePlayerStore } from "../../components/store/playerStore";




// export const gameStart = () => {
//     //1. 현재 플레이어의 인덱스값 찾아야 ....=> 금칙어 순서 설정 가능
//     find_my_index();
// }


export const find_my_index = (username) => {
    // store에서 현재 상태와 설정 함수를 가져옵니다
    const userList = UsePlayerStore.getState().userList;
    const setUserIndex = UsePlayerStore.getState().setUserIndex;

    // 유저리스트에서 현재 유저의 인덱스 찾기
    const newIndex = userList.findIndex((player) => player.username === username);

    // userIndex 설정하기
    setUserIndex(newIndex);
    // console.log(userIndex);
    
    return newIndex;
}
