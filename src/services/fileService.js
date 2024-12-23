import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import supabase from '../lib/supabase'

export class fileService {
    static async uploadFileAndGetLink(file, dest) {
        try {
            if (!file) return;

            console.log(file)

            const { data, error } = await supabase.storage.from(dest).upload(`uploads/${file.name}`, file);

            console.log('Uploaded image or file', data)

            const { data: publicUrl, error: urlError } = supabase.storage.from(dest).getPublicUrl(`uploads/${file.name}`);

            if (dest == 'files') {
                return { name: data.path.split('/')[1], url: publicUrl.publicUrl };
                // return { name: data.path.split('/')[1], url: publicUrl.publicUrl };
            }
            return publicUrl.publicUrl;
        } catch (error) {
            console.log(error)
        }
    }

    static async getDownloadLink(dest, file) {
        try {
            const { data, error } = await supabase.storage.from(dest).download(`uploads/${file.name}`);
            const url = URL.createObjectURL(data);
            // console.log(data)
            return url;
        } catch (error) {
            console.log(error)
        }
    }

    static async getAllSharedFiles(chatIds) {
        try {
            const chats = chatIds.map(async (chat) => {
                const docRef = doc(db, 'chat', chat);

                const data = await getDoc(docRef);

                return data.data().messages;
            });

            // console.log(chats)
            const chatsData = await Promise.all(chats);
            const messagesWithImgs = chatsData.map(chat => {
                const img = chat.filter((mes) => mes.img);
                return img;
            });

            const messages = messagesWithImgs.flat()

            // console.log(chatsData);
            // console.log(messagesWithImgs);
            // console.log(messages);

            return messages;
        } catch (error) {
            console.log(error)
        }
    }

    static async uploadAudio(audio) {
        try {
            // const bucket = supabase.storage.from('audio');
            // console.log(bucket);

            const fileName = `audio-${Date.now()}.ogg`;
            const { data, error } = await supabase.storage.from('audio').upload(`uploads/${fileName}`, audio);
            const { data: publicUrl, error: urlError } = supabase.storage.from('audio').getPublicUrl(`uploads/${fileName}`);

            console.log(publicUrl.publicUrl)
            return publicUrl.publicUrl;
        } catch (error) {
            console.log(error.message)
        }
    }
}