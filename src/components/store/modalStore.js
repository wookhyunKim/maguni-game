import { create } from 'zustand';

export const useModalStore = create((set) => ({
    modals: {
        FW: false,
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
