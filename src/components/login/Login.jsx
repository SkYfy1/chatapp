import { useRef, useState } from 'react'
import './login.css'
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase'
import { doc, setDoc } from 'firebase/firestore';
import supabase from '../../lib/supabase'
import userService from '../../services/userService';

const Login = () => {
    const [image, setImage] = useState({
        file: null,
        url: ''
    });

    const [loading, setLoading] = useState(false);

    const handleAddImage = (e) => {
        if (e.target.files[0]) {
            setImage({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)

        const formData = new FormData(e.target);

        const { email, password } = Object.fromEntries(formData);

        await userService.loginUser(email, password);
        setLoading(false)
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);

        const { username, email, password } = Object.fromEntries(formData);

        await userService.createUser({ username, email, password }, image);

        setLoading(false);
    }

    return (
        <div className='login'>
            <div className="item">
                <h2>Welcome back</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder='Email' name='email' />
                    <input type="text" placeholder='Password' name='password' />
                    <button disabled={loading}>{loading ? 'Loggining' : 'Sign Up'}</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
                <h2>Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <input type="file" id='file' onChange={handleAddImage} style={{ display: 'none' }} />
                    <label htmlFor="file">
                        <img src={image.url || './avatar.png'} alt="" />
                        Upload an image
                    </label>
                    <input type="text" placeholder='Username' name='username' />
                    <input type="text" placeholder='Email' name='email' />
                    <input type="text" placeholder='Password' name='password' />
                    <button disabled={loading}>{loading ? 'Creating account' : 'Sign Up'}</button>
                </form>
            </div>
        </div>
    )
}

export default Login



// try {
//     const res = await createUserWithEmailAndPassword(auth, email, password);

//     await setDoc(doc(db, 'users', res.user.uid), {
//         username,
//         email,
//         id: res.user.uid,
//         blocked: [],
//     })

//     await setDoc(doc(db, 'userschats', res.user.uid), {
//         chats: [],
//     })

//     // Use the JS library to create a bucket.

//     // const { data1, error1 } = await supabase.storage.createBucket('avatars', {
//     //     public: true, // или false, в зависимости от ваших требований
//     //   })


//     const { data, error } = supabase.storage.from('avatars').upload(`uploads/${image.file.name}`, image.file);

//     if (error) {
//         console.error('Error uploading file:', error.message);
//       } else {
//         console.log('File uploaded:', data);
//       }


//     toast.success('Account created! You can login now!')
// } catch (error) {
//     console.log(error)
//     toast.error(error.message)
// }