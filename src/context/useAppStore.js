import { create } from "zustand";

const useAppStore = create((set) => ({
    appLanguage: 'en',
    isMobile: false,
    showButton: false,
    creatingGroup: false,
    groupMembers: [],
    subscriptionWindow: false,

    changeSubWindowMode: () => { 
        set((state) => ({
            subscriptionWindow: !state.subscriptionWindow
        }))
    },

    addGroupMembers: (newMember) => {
        set((state) => ({
            groupMembers: [...state.groupMembers, newMember]
        }))
    },

    deleteGroupMembers: (newMember) => {
        set((state) => ({
            groupMembers: state.groupMembers.filter(el => el != newMember)
        }))
    },

    changeShowButton: () => {
        set((state) => ({
            showButton: !state.showButton
        }))
    },

    changeGroup: () => {
        set((state) => ({
            creatingGroup: !state.creatingGroup
        }))
    },

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