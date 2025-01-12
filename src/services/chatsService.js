import { auth, db } from '../lib/firebase'
import supabase from '../lib/supabase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc, collection, query, where, getDocs, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import { toast } from 'react-toastify';

export class chatService {
    static async createChat(uid, fid) {
        try {
            const chatRef = collection(db, 'chat');
            const userChatRef = collection(db, 'userchats');


            const newChatRef = doc(chatRef);

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: []
            })

            await updateDoc(doc(userChatRef, fid), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: uid,
                    updatedAt: Date.now(),
                })
            });

            await updateDoc(doc(userChatRef, uid), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: fid,
                    updatedAt: Date.now(),
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async createGroupChat(users, name) {
        try {
            const chatRef = collection(db, 'chat');
            const userChatRef = collection(db, 'userchats');

            const newChatRef = doc(chatRef);

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: []
            })

            await Promise.all(users.map(async (uid) => {
                await updateDoc(doc(userChatRef, uid), {
                    chats: arrayUnion({
                        chatId: newChatRef.id,
                        lastMessage: '',
                        groupMembers: users,
                        groupName: name,
                        groupAvatar: '',
                        updatedAt: Date.now(),
                    })
                });
            }))
        } catch (error) {
            console.log(error.message)
        }
    }

    static async changeMessageState(chatid, text) {
        // const chatRef = doc(db, 'chat', chatid);

        // const chatData = await getDoc(chatRef);

        // const chat = chatData.data();

        const chat = await getDocData('chat', chatid);

        // map messages array to find message and update state
        const updatedMessages = chat.messages.map((mes) => {
            // find message
            if (mes.text === text) {
                // check if message deleted
                return ({
                    ...mes,
                    deleted: mes.deleted ? false : true
                })
            } else {
                return mes;
            }
        });

        console.log(updatedMessages)

        await updateDoc(chatRef, {
            messages: updatedMessages
        })

        // const q = query(chatRef, where('text', '==', text));
        // console.log(q);

        console.log(chat)
    }

    static async messageAction(chatid, createdAt) {
        // const chatRef = doc(db, 'chat', chatid);

        // const chatData = await getDoc(chatRef);


        // const chat = chatData.data();

        const chat = await getDocData('chat', chatid);
        // map messages array to find message and update state
        const updatedMessages = chat.messages.map((mes) => {
            // find message
            if ((mes.createdAt.seconds + mes.createdAt.nanoseconds) === createdAt) {
                // check if message deleted
                return ({
                    ...mes,
                    like: mes.like ? false : true
                })
            } else {
                return mes;
            }
        });

        console.log(updatedMessages)

        await updateDoc(chatRef, {
            messages: updatedMessages
        })

        // const q = query(chatRef, where('text', '==', text));
        // console.log(q);

        console.log(chat)
    }
}