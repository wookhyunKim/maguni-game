import { create } from "zustand";
import { scriptData } from "../../assets/utils/gameScripts";

// 전체 시간 스토어
const useStoreTime = create((set) => ({
    time: 0,
    incrementTime: () => set((state) => ({ 
        time: state.time + 1
    })),
    resetTime: () => set({ time: 0 }),
}));

// 게임 정보 스토어
const useGameStore = create((set) => ({
    players: [],
    words: [],

    // 각 단계의 기본 시간 (초 단위)
    stages: {
        gameStart: {
            duration: 10,
            script: scriptData?.gameStart?.[0]?.text || "게임을 시작합니다",
        },
        forbiddenWordSelection: {
            duration: 20,
            script:
                scriptData?.forbiddenWordSelection?.[0]?.text ||
                "금칙어를 선택해주세요",
        },
        freeTalking: {
            duration: 120,
            script:
                scriptData?.freeTalkStartAnnouncement?.[0]?.text ||
                "자유 대화 시간입니다",
        },
        feverTime: {
            duration: 60,
            script: scriptData?.feverTime?.[0]?.text || "피버타임 시작",
        },
    },

    // 현재 단계 상태
    currentStage: "gameStart",
    sessionTime: 20,
    currentScript: scriptData?.gameStart?.[0]?.text || "게임을 시작합니다",

    // 상태 업데이트 함수들
    setPlayers: (players) => set({ players }),
    setWords: (words) => set({ words }),

    setStage: (stage) =>
        set((state) => ({
            currentStage: stage,
            sessionTime: state.stages[stage].duration,
            currentScript: state.stages[stage].script,
        })),

    decrementTime: () =>
        set((state) => ({
            sessionTime: Math.max(state.sessionTime - 1, 0),
        })),

    goToNextStage: () =>
        set((state) => {
            const nextStage =
                state.currentStage === "forbiddenWordSelection"
                    ? "freeTalking"
                    : state.currentStage === "freeTalking"
                    ? "feverTime"
                    : null;

            if (nextStage) {
                return {
                    currentStage: nextStage,
                    sessionTime: state.stages[nextStage].duration,
                    currentScript: state.stages[nextStage].script,
                };
            }
            return state;
        }),
}));

export { useStoreTime, useGameStore };
