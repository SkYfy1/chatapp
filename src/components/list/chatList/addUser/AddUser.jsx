import React, { useState } from 'react'
import './addUser.css'
import userService from '../../../../services/userService';
import { chatService } from '../../../../services/chatsService';
import { useAuthStore } from '../../../../context/useAuthStore';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { toast } from 'react-toastify';

const AddUser = ({ handler }) => {
    const [friends, setFriends] = useState(null);
    const currentUser = useAuthStore(state => state.currentUser)
    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userName = formData.get('username');
        const query = await userService.findUser(userName);
        if (query) {
            // Filter users to remove current user
            setFriends(query.filter(u => u.id != currentUser.id));
        }
    }
    
    // const handleAdd = async (fId) => {
    //     // Get userchat doc to find out, is the user already friend
    //     const userChats = doc(db, 'userchats', currentUser.id)

    //     const data = await getDoc(userChats)

    //     // console.log(data.data().chats.find(el => el.receiverId === fId));

    //     // Check if user already friend

    //     if (data.data().chats.find(el => el.receiverId === fId)) {
    //         toast.error('The user is already your friend')
    //     } else {
    //         await chatService.createChat(fId, currentUser.id);
    //         setTimeout(() => changeShow(), 1000)
    //     }
    // }

    return (
        <div className='addUser'>
            <form onSubmit={handleSearch}>
                <input type="text" placeholder='Username' name='username' />
                <button>Search</button>
            </form>
            {
                friends
                &&
                friends.map(friend =>
                    <div className='userElem' key={friend.username}>
                        <div className="details">
                            <img src={friend.avatar} alt="" />
                            <span>{friend.username}</span>
                        </div>
                        <button onClick={() => handler(friend.id)}>
                            Add User
                        </button>
                    </div>)
            }
        </div>
    )
}

export default AddUser
