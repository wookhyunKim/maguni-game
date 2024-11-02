import { create } from 'zustand';

export const useModalStore = create((set) => ({
    modals: {
        //금칙어 공개 모달
        forbiddenWordlist: false,
        //금칙어 설정 안내 모달
        settingForbiddenWord: false,
        //게임 결과 안내 모달
        gameResult: false,
        goongYeAnouncingEnd: false,
    },
    setModal: (modalName, isOpen) => 
        set((state) => ({
            modals: {
                ...state.modals,
                [modalName]: isOpen
            }
        })),
}));
