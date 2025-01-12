import { auth, db } from '../lib/firebase'
import supabase from '../lib/supabase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc, collection, query, where, getDocs, arrayUnion, arrayRemove, updateDoc, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { fileService } from './fileService';
import { getDocData } from '../utils/firebaseFunc';


class userService {
    static async createUser(user, image) {
        try {
            // Image upload

            if (image) {
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
                    avatar: publicURL?.publicUrl || null,
                    prevImgs: [],
                    blocked: [],
                }).catch(error => {
                    console.error('Error in users setDoc:', error.message);
                });

                await setDoc(doc(db, 'userchats', res.user.uid), {
                    chats: [],
                }).catch(error => {
                    console.error('Error in users setDoc:', error.message);
                });
            } else {
                const res = await createUserWithEmailAndPassword(auth, user.email, user.password);

                console.log(res)

                await setDoc(doc(db, 'users', res.user.uid), {
                    username: user.username,
                    email: user.email,
                    id: res.user.uid,
                    avatar: publicURL?.publicUrl || null,
                    prevImgs: [],
                    blocked: [],
                }).catch(error => {
                    console.error('Error in users setDoc:', error.message);
                });

                await setDoc(doc(db, 'userchats', res.user.uid), {
                    chats: [],
                }).catch(error => {
                    console.error('Error in users setDoc:', error.message);
                });
            }
            toast.success('Account created! You can login now!')
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    static async loginUser(email, password) {
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            console.log(res)
            toast.success('Welcome back!')
        } catch (error) {
            console.log(error.message)
        }
    }

    static async getUserInfo(uid) {
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log('Document data: ', docSnap.data());
                return docSnap.data();
            } else {
                console.log('No such document');
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    static async findUser(name) {
        try {
            const userRef = collection(db, 'users');
            // const q = query(userRef, where('username', '==', name));

            const searchTerm = name.toLowerCase();
            const strlength = searchTerm.length;
            const strFrontCode = searchTerm.slice(0, strlength - 1);
            const strEndCode = searchTerm.slice(strlength - 1, searchTerm.length);
            // This is an important bit..
            const endCode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
            const q = query(userRef, where('username', ">=", searchTerm), where('username', "<", endCode))
            console.log(q);

            const querySnapShot = await getDocs(q);

            if (!querySnapShot.empty) {
                const docs = querySnapShot.docs.map((el) => el.data());
                return docs;
            }

            // if (!querySnapShot.empty) {
            //     console.log(querySnapShot.docs[0].data())
            //     return querySnapShot.docs[0].data();
            // }
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

            // const userRef = doc(db, 'users', uid);

            // const data = await getDoc(userRef);

            // const userDoc = data.data();

            const userDoc = await getDocData('users', uid);

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
                prevImgs: ((imgLink && userDoc.hasOwnProperty("prevImgs")) ? arrayUnion(userDoc.avatar) : []),
                ...(imgLink && { avatar: imgLink }),
            });
        } catch (error) {
            console.log(error.message)
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
            console.log(error.message)
        }
    }

    static async changeStatus(id, status) {
        try {
            const docRef = doc(db, 'users', id);

            await updateDoc(docRef, {
                status: status
            });

            console.log('User ' + status)
        } catch (error) {
            console.log(error.message)
        }
    }

    static async toggleAnims(id) {
        try {
            // const docRef = doc(db, 'users', id);

            // const data = (await getDoc(docRef)).data();

            const data = await getDocData('users', id);

            if (data.hasOwnProperty('settings')) {
                await updateDoc(docRef, {
                    settings: {
                        animations: !data.settings.animations
                    }
                });
                return;
            }

            await updateDoc(docRef, {
                settings: {
                    animations: false
                }
            });

            console.log('User ' + JSON.stringify(data))
        } catch (error) {
            console.log(error.message)
        }
    }
}

export default userService;