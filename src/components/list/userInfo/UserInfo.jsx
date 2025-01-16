import './userInfo.css'
import React, { useEffect } from 'react'
import { useAuthStore } from '../../../context/useAuthStore'
import useChatStore from '../../../context/useChatStore';

const UserInfo = ({ openSettings }) => {
  const userInfo = useAuthStore((state) => state.currentUser);

  return (
    <div className='userInfo'>
      <div className="user">
        <img onClick={openSettings} src={userInfo.avatar || './avatar.png'} alt="avatar" />
        <h2>{userInfo.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="more_button" onClick={openSettings} />
        <img src="./video.png" alt="video_button" />
        <img src="./edit.png" alt="edit_button" />
      </div>
    </div>
  )
}

export default UserInfo
