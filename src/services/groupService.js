import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { fileService } from "./fileService";
import supabase from "../lib/supabase";

export class groupService {
    static async changeGroupName(users, chatId, newName) {
        await Promise.all(users.map(async (userId) => {
            const chatRef = doc(db, 'userchats', userId);

            const snapshot = await getDoc(chatRef);

            const chats = snapshot.data();

            const chatIndex = chats.chats.findIndex(c => c.chatId === chatId);

            chats.chats[chatIndex].groupName = newName;
            chats.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(chatRef, {
                chats: chats.chats
            })
        }))
    }

    static async changeGroupAvatar(users, chatId, newAvatar) {
        const imgLink = fileService.uploadFileAndGetLink(newAvatar, 'avatars');

        await Promise.all(users.map(async (userId) => {
            const chatRef = doc(db, 'userchats', userId);

            const snapshot = await getDoc(chatRef);

            const chats = snapshot.data();

            const chatIndex = chats.chats.findIndex(c => c.chatId === chatId);

            chats.chats[chatIndex].groupAvatar = imgLink;
            chats.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(chatRef, {
                chats: chats.chats
            })
        }))
    }

    static async kickGroupUser(users, chatId, uid) {
        await Promise.all(users.map(async (userId) => {
            const chatRef = doc(db, 'userchats', userId);

            const snapshot = await getDoc(chatRef);

            const chats = snapshot.data();

            const chatIndex = chats.chats.findIndex(c => c.chatId === chatId);

            const newArray = chats.chats[chatIndex].groupMembers.filter((id) => id !== uid);

            chats.chats[chatIndex].groupMembers = newArray;
            chats.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(chatRef, {
                chats: chats.chats
            })
        }))
    }

    static async addGroupUser(users, chatId, uid) {
        await Promise.all(users.map(async (userId) => {
            const chatRef = doc(db, 'userchats', userId);

            const snapshot = await getDoc(chatRef);

            const chats = snapshot.data();

            const chatIndex = chats.chats.findIndex(c => c.chatId === chatId)

            const newArray = [...chats.chats[chatIndex].groupMembers, uid];

            chats.chats[chatIndex].groupMembers = newArray;
            chats.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(chatRef, {
                chats: chats.chats
            })
        }))
    }
}