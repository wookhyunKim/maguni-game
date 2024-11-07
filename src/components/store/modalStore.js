import { create } from 'zustand';

export const useModalStore = create((set) => ({
    modals: {

        instructionModal: false,
        SettingForbiddenWordModal: false,
        FW: false,
        //게임 결과 안내 모달
        gameResult: false,
        goongYeAnouncingEnd: false,
        goongYeAnnouncingResult: false,

    },
    setModal: (modalName, isOpen) => 
        set((state) => ({
            modals: {
                ...state.modals,
                [modalName]: isOpen
            }
        })),
}));
