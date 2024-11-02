// useGameStageStore.js
import { create } from 'zustand'
import {scriptData} from '../../assets/gameScripts'

// 게임 단계에 대한 store

// 게임 단계는 총 5단계로 구성됨
// 단계는 크게 두 종류: 궁예 모달 단계, 실제 게임 단계
// 궁예 모달 단계: goongye로 시작함
// 실제 게임 단계: stage로 시작함

const getRandomScript = (scriptArray) => {
  return scriptArray[Math.floor(Math.random() * scriptArray.length)];
}

const useGameStageStore = create((set) => ({

  //게임 룰 설명단계: 5초
  goongYeRule: {
    sessiontime: 5,
    script: getRandomScript(scriptData.goongYeRule)
  },

  //각 플레이어의 금칙어 선정 궁예 안내 단계: 5초
  goongYeForbiddenWord: {
    sessiontime: 5,
    script: getRandomScript(scriptData.goongYeForbiddenWord)
  },

  //금칙어 설정단계: 20초
  //참가자 인원 수 만큼 해당 단계 반복
  stageSettingForbiddenWord: {
    sessiontime: 20
  },

  //금칙어 공개단계: 5초
  goongYeRevealForbiddenWord: {
    sessiontime: 5,
    script: scriptData.revealForbiddenWord
  },

  //게임 진행단계 120초
  stagePlayingTime: {
    sessiontime: 120,
    script: getRandomScript(scriptData.stagePlayingTime)
  },

  goongYeAnouncingEnd: {
    sessiontime: 5,
    script: getRandomScript(scriptData.goongYeAnouncingEnd)
  },

  goongYeAnnouncingResult: {
    sessiontime: 5,
    script: getRandomScript(scriptData.goongYeAnnouncingResult)
  },

  resetScripts: () => set(state => ({
    goongYeRule: {
      ...state.goongYeRule,
      script: getRandomScript(scriptData.goongYeRule)
    },
    goongYeForbiddenWord: {
      ...state.goongYeForbiddenWord,
      script: getRandomScript(scriptData.goongYeForbiddenWord)
    },
    // ... 다른 단계들도 같은 방식으로 리셋
    stagePlayingTime: {
      ...state.stagePlayingTime,
      script: getRandomScript(scriptData.stagePlayingTime)
    },
    goongYeAnouncingEnd: {
      ...state.goongYeAnouncingEnd,
      script: getRandomScript(scriptData.goongYeAnouncingEnd)
    },
    goongYeAnnouncingResult: {
      ...state.goongYeAnnouncingResult,
      script: getRandomScript(scriptData.goongYeAnnouncingResult)
    }
  }))
}))

export default useGameStageStore