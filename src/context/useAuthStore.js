import { create } from 'zustand'
import userService from '../services/userService';

export const useAuthStore = create((set) => ({
    currentUser: null,
    userChats: [],
    isLoading: true,

    updateChats: async (chats) => {
        set({ userChats: chats })
    },

    fetchUserInfo: async (uid) => {
        if (!uid) return set({ currentUser: null, isLoading: false });
        try {
            const user = await userService.getUserInfo(uid);

            set({ currentUser: user, isLoading: false })

        } catch (error) {
            console.log(err.message);
            return set({ currentUser: null, isLoading: false });
        }
    },

    updateUserInfo: async (data) => {
        if (!data) return;

        try {
            set({
                currentUser: data
            })
        } catch (error) {
            console.log(error);
        }
    }
}))