import { create } from "zustand";

const useAppStore = create((set) => ({
    appLanguage: 'en',
    isMobile: false,
    animation: true,

    changeLanguage: (lang) => set({
        appLanguage: lang
    }),

    toggleAnimation: () => {
        console.log('changingValue');
        set((state) => ({
            animation: !state.animation
        }))
    },

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