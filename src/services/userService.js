import { auth, db } from '../lib/firebase'
import supabase from '../lib/supabase'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';


class userService {
    static async createUser(user, image) {
        try {
            // const res = await createUserWithEmailAndPassword(auth, user.email, user.password);

            // await setDoc(doc(db, 'users', res.user.uid), {
            //     username: user.username,
            //     email: user.email,
            //     id: res.user.uid,
            //     blocked: [],
            // })

            // await setDoc(doc(db, 'userschats', res.user.uid), {
            //     chats: [],
            // })

            // Use the JS library to create a bucket.

            // const { data1, error1 } = await supabase.storage.createBucket('avatars', {
            //     public: true, // или false, в зависимости от ваших требований
            //   })


            const { data, error: uploadError } = await supabase.storage.from('avatars').upload(`uploads/${image.file.name}`, image.file);
            

            if (uploadError) {
                console.error('Error uploading file:', uploadError.message);
            } else {
                console.log(data);
            }

            const { data: publicURL, error: urlError } = supabase.storage.from('avatars').getPublicUrl(`uploads/${image.file.name}`)
            
            // const { publicURL, error: urlError } = await supabase.storage.from('avatars').createSignedUrl(`uploads/${image.file.name}`, 60)

            if (urlError) {
                console.error('Error uploading file:', urlError.message);
            } else {
                console.log(publicURL);
            }

            toast.success('Account created! You can login now!')
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
}

export default userService;