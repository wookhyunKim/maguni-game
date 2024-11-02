import { create } from 'zustand';

export const useModalStore = create((set) => ({
    modals: {
        FW: false,
        settingForbiddenWord: false,
        gameResult: false,
        settings: false,
        // ... 다른 모달들
    },
    setModal: (modalName, isOpen) => 
        set((state) => ({
            modals: {
                ...state.modals,
                [modalName]: isOpen
            }
        })),
}));
