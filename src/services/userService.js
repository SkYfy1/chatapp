import { auth, db } from '../lib/firebase'
import supabase from '../lib/supabase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc, collection, query, where, getDocs, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { fileService } from './fileService';


class userService {
    static async createUser(user, image) {
        try {
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


            if (urlError) {
                console.error('Error uploading file:', urlError.message);
            } else {
                console.log(publicURL);
            }

            const res = await createUserWithEmailAndPassword(auth, user.email, user.password);

            console.log(res)

            await setDoc(doc(db, 'users', res.user.uid), {
                username: user.username,
                email: user.email,
                id: res.user.uid,
                avatar: publicURL.publicUrl,
                blocked: [],
            })

            await setDoc(doc(db, 'userchats', res.user.uid), {
                chats: [],
            })

            toast.success('Account created! You can login now!')
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    static async loginUser(email, password) {
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            toast.success('Welcome back!')
        } catch (error) {
            console.log(error.message)
        }
    }

    static async getUserInfo(uid) {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log('Document data: ', docSnap.data());
            return docSnap.data();
        } else {
            console.log('No such document')
        }
    }

    static async findUser(name) {
        try {
            const userRef = collection(db, 'users');
            const q = query(userRef, where('username', '==', name));
            console.log(q);

            const querySnapShot = await getDocs(q);

            if (!querySnapShot.empty) {
                console.log(querySnapShot.docs[0].data())
                return querySnapShot.docs[0].data();
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    static async blockUser(isBlocked, uid, fid) {
        try {
            const userDoc = doc(db, 'users', uid);

            await updateDoc(userDoc, {
                blocked: isBlocked ? arrayRemove(fid) : arrayUnion(fid)
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async updateUserData(newImage = null, username = null, uid = null, phone = null, about = null) {
        try {
            const imgLink = await fileService.uploadFileAndGetLink(newImage, 'avatars');

            console.log(phone)

            const userRef = doc(db, 'users', uid);

            const data = await getDoc(userRef);

            const userDoc = data.data();

            // Checking existing name or not
            const nameRef = collection(db, 'users');
            const q = query(nameRef, where('username', '==', username));

            const querySnapShot = await getDocs(q);

            if (!querySnapShot.empty && data.data().username !== username) {
                throw new Error('Username is taken by another user')
            }

            console.log('About: ' + about)

            await updateDoc(userRef, {
                username,
                phoneNumber: phone || 'No number',
                about: about || 'Nothing...',
                prevImgs: userDoc.hasOwnProperty("prevImgs") ? arrayUnion(userDoc.avatar) : [],
                ...(imgLink && { avatar: imgLink }),
            });
        } catch (error) {
            console.log(error)
        }
    }

    static async returnUserImage(imgLink, img, uid) {
        try {
            const userRef = doc(db, 'users', uid);

            await updateDoc(userRef, {
                avatar: imgLink,
                prevImgs: arrayRemove(imgLink)
            })

            await updateDoc(userRef, {
                prevImgs: arrayUnion(img)
            });

        } catch (error) {
            console.log(error)
        }
    }
}

export default userService;