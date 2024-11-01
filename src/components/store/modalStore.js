import { create } from 'zustand';

export const useModalStore = create((set) => ({
    modals: {
        forbiddenWordlist: false,
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
