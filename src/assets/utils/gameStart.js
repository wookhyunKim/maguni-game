import { UsePlayerStore } from "../../components/store/playerStore";



export const gameStart = () => {
    //1. 현재 플레이어의 인덱스값 찾아야 ....=> 금칙어 순서 설정 가능
    find_my_index();
}


const find_my_index = (username) => {
    const players = UsePlayerStore((state) => state.players);
    const setUserIndex= UsePlayerStore((state) => state.setUserIndex);

    //userIndex 설정하기
    setUserIndex(players.findIndex((player) => player === username));
    
}
