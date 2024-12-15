import { create } from "zustand";

const useAppStore = create((set) => ({
    appLanguage: 'en',

    changeLanguage: (lang) => set({
        appLanguage: lang
    })
}));

export default useAppStore;