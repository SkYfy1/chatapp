import { useRef, useState } from 'react'
import './login.css'
import { toast } from 'react-toastify';

const Login = () => {
    const [image, setImage] = useState({
        file: null,
        url: ''
    });

    const handleAddImage = (e) => {
        if (e.target.files[0]) {
            setImage({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        toast.warn('Hello')
    }

    return (
        <div className='login'>
            <div className="item">
                <h2>Welcome back</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder='Email' name='email' />
                    <input type="text" placeholder='Password' name='password' />
                    <button>Sign In</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
                <h2>Create an Account</h2>
                <form>
                    <input type="file" id='file' onChange={handleAddImage} style={{ display: 'none' }} />
                    <label htmlFor="file">
                        <img src={image.url || './avatar.png'} alt="" />
                        Upload an image
                    </label>
                    <input type="text" placeholder='Username' name='username' />
                    <input type="text" placeholder='Email' name='email' />
                    <input type="text" placeholder='Password' name='password' />
                    <button>Sign Up</button>
                </form>
            </div>
        </div>
    )
}

export default Login
