import { create } from "zustand";

const useAppStore = create((set) => ({
    language: 'en',

    changeLanguage: (lang) => set({
        language: lang
    })
}));

export default useAppStore;