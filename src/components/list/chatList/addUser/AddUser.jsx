import React, { useState } from 'react'
import './addUser.css'
import userService from '../../../../services/userService';
import { chatService } from '../../../../services/chatsService';
import { useAuthStore } from '../../../../context/useAuthStore';

const AddUser = ({ show, changeShow }) => {
    const [friend, setFriend] = useState(null);
    const currentUser = useAuthStore(state => state.currentUser)
    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userName = formData.get('username');
        const user = await userService.findUser(userName);
        if (user) {
            setFriend(user);
        }
    }

    const handleAdd = async () => {
        await chatService.createChat(friend.id, currentUser.id);
        setTimeout(changeShow, 2000)
    }
    return (
        <div className='addUser'>
            <form onSubmit={handleSearch}>
                <input type="text" placeholder='Username' name='username' />
                <button>Search</button>
            </form>
            {friend && <div className='user'>
                <div className="details">
                    <img src={friend.avatar} alt="" />
                    <span>{friend.username}</span>
                </div>
                <button onClick={handleAdd}>
                    Add User
                </button>
            </div>}
        </div>
    )
}

export default AddUser
