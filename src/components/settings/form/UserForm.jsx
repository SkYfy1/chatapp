import React, { useEffect, useRef } from 'react'
import './userForm.css'
import { useForm, } from 'react-hook-form'
import { useAuthStore } from '../../../context/useAuthStore'
import userService from '../../../services/userService'

const UserForm = ({ headBack }) => {
    const userData = useAuthStore(state => state.currentUser);
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
        userService.updateUserData(null, data.username, userData.id, data.phone, data.about);
        headBack();
    };

    useEffect(() => {
        console.log(formState.defaultValues)
        console.log(formState.errors)
    }, [formState])

    return (
        <div className='userForm'>
            <div className='top'>
                <div className='back'>
                    <svg onClick={headBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.49 12 3.74 8.248m0 0 3.75-3.75m-3.75 3.75h16.5V19.5" />
                    </svg>
                    <h2>Change Profile</h2>
                </div>
            </div>
            <div className="imgChange">
                <div className='wrapper'>
                    <div className="background">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                    </div>
                    <img src={userData.avatar || './avatar.png'} alt="avatar" />
                </div>
            </div>
            <form className="form" id='form' onSubmit={handleSubmit(onSubmit)}>
                <div className='formInput'>
                    <label className={formState.defaultValues.username && 'isDirty'} htmlFor="name">Name (Necessarily)</label>
                    <input id='name' type="text" {...register('username')} />
                </div>
                <div className='formInput'>
                    <label className={(formState.dirtyFields.phone || formState.defaultValues.phone) && 'isDirty'} htmlFor="phone">Phone (Necessarily)</label>
                    <input id='phone' type="text" {...register('phone', {
                        pattern: {
                            value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                            message: 'Not valid phone number'
                        }
                    })} />
                    {formState.errors.phone && <p>{formState.errors.phone.message}</p>}
                </div>
                <div className='formInput'>
                    <label className={(formState.dirtyFields.about || formState.defaultValues.about) && 'isDirty'} htmlFor="about">About (Unnecessarily)</label>
                    <input id='about' type="text" {...register('about')} />
                </div>
            </form>
            <button type='submit' form='form' className={(formState.dirtyFields.username || formState.dirtyFields.about || formState.dirtyFields.phone) && 'showButton'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            </button>
        </div>
    )
}

export default UserForm
