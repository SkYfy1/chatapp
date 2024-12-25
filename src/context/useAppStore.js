import { create } from "zustand";

const useAppStore = create((set) => ({
    appLanguage: 'en',
    isMobile: false,

    changeLanguage: (lang) => set({
        appLanguage: lang
    }),

    checkScreen: () => {
            if (window.innerWidth < 720) {
                console.log('mobile')
                return set({ isMobile: true });
            } else {
                console.log('mobile')
                return set({ isMobile: false });
            }
    }
}));

export default useAppStore;