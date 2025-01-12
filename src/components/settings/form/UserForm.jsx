import React, { useEffect, useRef, useState } from 'react'
import './userForm.css'
import { useForm, } from 'react-hook-form'
import { useAuthStore } from '../../../context/useAuthStore'
import userService from '../../../services/userService'
import language from '../../../utils/language'
import useAppStore from '../../../context/useAppStore'

const UserForm = ({ headBack }) => {
    const userData = useAuthStore(state => state.currentUser);
    const appState = useAppStore()
    const [img, setImg] = useState({
        file: null,
        url: null,
    })
    const {
        register,
        handleSubmit,
        formState,
    } = useForm({
        defaultValues: {
            username: userData.username,
            phone: userData?.phoneNumber,
            about: userData?.about
        }
    });

    const onSubmit = (data) => {
        // alert(JSON.stringify(data));
        // console.log(JSON.stringify(data));
        if (!formState.dirtyFields.username) {
            userService.updateUserData(img?.file, userData.username, userData.id, data.phone, data.about);
        } else {
            userService.updateUserData(img?.file, data.username, userData.id, data.phone, data.about);
        }
        headBack();
    };

    useEffect(() => {
        console.log(img)
    }, [img])

    return (
        <div className='userForm'>
            <div className='tope'>
                <div className='back'>
                    <svg onClick={headBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.49 12 3.74 8.248m0 0 3.75-3.75m-3.75 3.75h16.5V19.5" />
                    </svg>
                    <h2>{appState.appLanguage == 'en' ? 'Change Profile' : 'Змінити дані'}</h2>
                </div>
            </div>
            <div className="imgChange">
                <label className='wrapper' htmlFor='imgInput'>
                    {!img.url && <div className="background">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                    </div>}
                    <img src={img.url ? img.url : userData.avatar || './avatar.png'} alt="avatar" />
                    <input type="file" id='imgInput' style={{ display: 'none' }} onChange={(e) => setImg({ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) })} />
                </label>
            </div>
            <form className="form" id='form' onSubmit={handleSubmit(onSubmit)}>
                <div className='formInput'>
                    <label className={formState.defaultValues.username && 'isDirty'} htmlFor="name">{language.settings.form[appState.appLanguage][0]}</label>
                    <input id='name' type="text" {...register('username')} />
                </div>
                <div className='formInput'>
                    <label className={(formState.dirtyFields.phone || formState.defaultValues.phone) && 'isDirty'} htmlFor="phone">{language.settings.form[appState.appLanguage][1]}</label>
                    <input id='phone' type="text" {...register('phone', {
                        pattern: {
                            value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                            message: 'Not valid phone number'
                        }
                    })} />
                    {formState.errors.phone && <p>{formState.errors.phone.message}</p>}
                </div>
                <div className='formInput'>
                    <label className={(formState.dirtyFields.about || formState.defaultValues.about) && 'isDirty'} htmlFor="about">{language.settings.form[appState.appLanguage][2]}</label>
                    <input id='about' type="text" {...register('about')} />
                </div>
            </form>
            <button type='submit' form='form' className={(formState.dirtyFields.username || formState.dirtyFields.about || formState.dirtyFields.phone || img?.file) && 'showButton'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            </button>
        </div>
    )
}

export default UserForm
