import { create } from "zustand";

export const detectModelStore = create((set) => ({
    detectModel: undefined,
    setDetectModel: (getModel) => set({ detectModel: getModel }),
}));

export default detectModelStore;
