import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { fileService } from "./fileService";
import { getDocData } from "../utils/firebaseFunc";

export class groupService {
    static async changeGroupName(users, chatId, newName) {
        try {
            await Promise.all(users.map(async (userId) => {
                // const chatRef = doc(db, 'userchats', userId);

                // const snapshot = await getDoc(chatRef);

                // const chats = snapshot.data();

                const [chats, chatRef] = await getDocData('userchats', userId);

                const chatIndex = chats.chats.findIndex(c => c.chatId === chatId);

                chats.chats[chatIndex].groupName = newName;
                chats.chats[chatIndex].updatedAt = Date.now();

                await updateDoc(chatRef, {
                    chats: chats.chats
                })
            }))
        } catch (error) {
            console.log(error.message)
        }
    }

    static async changeGroupAvatar(users, chatId, newAvatar) {
        try {
            const imgLink = await fileService.uploadFileAndGetLink(newAvatar, 'avatars');

            await Promise.all(users.map(async (userId) => {
                // const chatRef = doc(db, 'userchats', userId);

                // const snapshot = await getDoc(chatRef);

                // const chats = snapshot.data();

                const [chats, chatRef] = await getDocData('userchats', userId);

                const chatIndex = chats.chats.findIndex(c => c.chatId === chatId);

                chats.chats[chatIndex].groupAvatar = imgLink;
                chats.chats[chatIndex].updatedAt = Date.now();

                await updateDoc(chatRef, {
                    chats: chats.chats
                })
            }))
        } catch (error) {
            console.log(error.message)
        }
    }

    static async kickGroupUser(users, chatId, uid) {
        try {
            await Promise.all(users.map(async (userId) => {
                // const chatRef = doc(db, 'userchats', userId);

                // const snapshot = await getDoc(chatRef);

                // const chats = snapshot.data();

                const [chats, chatRef] = await getDocData('userchats', userId);

                const chatIndex = chats.chats.findIndex(c => c.chatId === chatId);

                // Delete id of kicked user from groupMembers

                const newArray = chats.chats[chatIndex].groupMembers.filter((id) => id !== uid);

                chats.chats[chatIndex].groupMembers = newArray;
                chats.chats[chatIndex].updatedAt = Date.now();

                // Delete chat from user which are kicked

                const updatedChats = chats.chats.filter(chat => chat.chatId !== chatId);

                // if (userId === uid) {
                //     await updateDoc(chatRef, {
                //         chats: arrayRemove()
                //     })
                // }

                await updateDoc(chatRef, {
                    chats: userId === uid ? updatedChats : chats.chats
                })
            }))
        } catch (error) {
            console.log(error.message)
        }
    }

    static async addGroupUser(users, chatId, uid) {
        try {
            let chatCopy = null;

            const userList = users.filter((id) => id != uid);

            await Promise.all(userList.map(async (userId) => {
                // const chatRef = doc(db, 'userchats', userId);

                // const snapshot = await getDoc(chatRef);

                // const chats = snapshot.data();

                const [chats, chatRef] = await getDocData('userchats', userId);

                const chatIndex = chats.chats.findIndex(c => c.chatId === chatId)

                const newArray = [...chats.chats[chatIndex].groupMembers, uid];

                chats.chats[chatIndex].groupMembers = newArray;
                chats.chats[chatIndex].updatedAt = Date.now();

                await updateDoc(chatRef, {
                    chats: chats.chats
                });

                chatCopy = !chatCopy && chats.chats[chatIndex]
            }))

            const chatRef = doc(db, 'userchats', uid);

            await updateDoc(chatRef, {
                chats: arrayUnion(chatCopy)
            });

        } catch (error) {
            console.log(error.message)
        }
    }
}