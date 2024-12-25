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
                set({ isMobile: true });
                return;
            } else {
                console.log('pc')
                set({ isMobile: false });
                return;
            }
    }
}));

export default useAppStore;