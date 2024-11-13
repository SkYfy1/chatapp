import './userInfo.css'
import React from 'react'
import '../../../../public/avatar.png'

const UserInfo = () => {
  return (
    <div className='userInfo'>
      <div className="user">
        <img src='../../../../public/avatar.png' alt="" />
      </div>
      <div className="icons">
        <img src="./more.png" alt="" />
        <img src="./video.png" alt="" />
        <img src="./edit.png" alt="" />
      </div>
    </div>
  )
}

export default UserInfo
